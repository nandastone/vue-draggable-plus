import Sortable from 'sortablejs';
import { type Ref } from 'vue-demi';

// SortableJS plugins that implement three drag UX concerns in a
// framework-agnostic way, mounted once at module load. Consumers opt in per
// sortable via options: `cloneGhost`, `hideOnLeave`. `BodyClass` and
// `DragStateTracker` initialize by default and run on every drag.

interface PluginArgs {
  sortable: Sortable;
  isOwner?: boolean;
}

// ---------------------------------------------------------------------------
// CloneGhost
//
// Swaps `dragEl.innerHTML` with a destination-provided preview when a
// cross-list drag enters a sortable that has `cloneGhost` configured. The
// original markup is restored when the drag leaves (back to source or to
// another destination), when SortableJS reverts dragEl to its origin, and
// on drop/nulling.
//
// Cross-sortable behavior is driven by SortableJS's own event flow rather
// than any shared module state: each sortable instance's `dragOverValid`
// hook applies the ghost when its own sortable is the current drop target.
// ---------------------------------------------------------------------------

const CLONE_GHOST_ORIGINAL_HTML = Symbol('cloneGhostOriginalHtml');
const CLONE_GHOST_ORIGINAL_WIDTH = Symbol('cloneGhostOriginalWidth');
const CLONE_GHOST_ORIGINAL_HEIGHT = Symbol('cloneGhostOriginalHeight');
const CLONE_GHOST_APPLIED_BY = Symbol('cloneGhostAppliedBy');

type CloneGhostFactory = () => HTMLElement | string | null;

type CloneGhostEl = HTMLElement & {
  [CLONE_GHOST_ORIGINAL_HTML]?: string;
  [CLONE_GHOST_ORIGINAL_WIDTH]?: string;
  [CLONE_GHOST_ORIGINAL_HEIGHT]?: string;
  [CLONE_GHOST_APPLIED_BY]?: HTMLElement;
};

function getDraggedEl(): CloneGhostEl | null {
  return (Sortable as unknown as { dragged: HTMLElement | null })
    .dragged as CloneGhostEl | null;
}

function getGhostEl(): CloneGhostEl | null {
  return (Sortable as unknown as { ghost: HTMLElement | null })
    .ghost as CloneGhostEl | null;
}

function restoreCloneGhost(el: CloneGhostEl | null): void {
  if (!el || !el[CLONE_GHOST_APPLIED_BY]) return;
  const html = el[CLONE_GHOST_ORIGINAL_HTML];
  if (typeof html === 'string') el.innerHTML = html;
  const width = el[CLONE_GHOST_ORIGINAL_WIDTH];
  if (typeof width === 'string') el.style.width = width;
  const height = el[CLONE_GHOST_ORIGINAL_HEIGHT];
  if (typeof height === 'string') el.style.height = height;
  el[CLONE_GHOST_ORIGINAL_HTML] = undefined;
  el[CLONE_GHOST_ORIGINAL_WIDTH] = undefined;
  el[CLONE_GHOST_ORIGINAL_HEIGHT] = undefined;
  el[CLONE_GHOST_APPLIED_BY] = undefined;
}

function applyCloneGhost(
  el: CloneGhostEl,
  factory: CloneGhostFactory,
  appliedBy: HTMLElement,
): void {
  const preview = factory();
  if (!preview) return;
  el[CLONE_GHOST_ORIGINAL_HTML] = el.innerHTML;
  el[CLONE_GHOST_ORIGINAL_WIDTH] = el.style.width;
  el[CLONE_GHOST_ORIGINAL_HEIGHT] = el.style.height;
  el.innerHTML = typeof preview === 'string' ? preview : preview.innerHTML;
  // Match the preview's measured box so the cursor-follower and placeholder
  // morph to the destination's card dimensions instead of the source item's.
  // Consumers that need a specific size should style the preview element at
  // that size before returning it. String previews fall back to auto sizing.
  if (preview instanceof HTMLElement) {
    const rect = preview.getBoundingClientRect();
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
  } else {
    el.style.width = '';
    el.style.height = '';
  }
  el[CLONE_GHOST_APPLIED_BY] = appliedBy;
}

function applyIfFresh(
  el: CloneGhostEl | null,
  factory: CloneGhostFactory,
  appliedBy: HTMLElement,
): void {
  if (!el) return;
  if (el[CLONE_GHOST_APPLIED_BY] === appliedBy) return;
  if (el[CLONE_GHOST_APPLIED_BY]) restoreCloneGhost(el);
  applyCloneGhost(el, factory, appliedBy);
}

function restoreAll(): void {
  restoreCloneGhost(getDraggedEl());
  restoreCloneGhost(getGhostEl());
}

// ---------------------------------------------------------------------------
// CloneGhostOnStart
//
// Destinations that opt in with `cloneGhostOnStart: true` register their
// preview factory here. The source sortable's merged `onStart` calls
// triggerCloneGhostOnStart once Sortable.ghost exists, which applies each
// registered preview to the cursor-follower. A MutationObserver mirrors
// subsequent preview DOM changes (e.g. async component resolution) onto the
// ghost so the consumer doesn't have to wait for dragOverValid to refresh.
//
// Registration is driven from useDraggable rather than from a plugin hook
// because SortableJS's `dragStart` plugin events fire before `_appendGhost`,
// and the user-facing `onStart` callback fires on the source only, so the
// fork has to broadcast to destinations from there.
// ---------------------------------------------------------------------------

const cloneGhostOnStartRegistrations = new Map<HTMLElement, CloneGhostFactory>();
const cloneGhostOnStartObservers = new Map<HTMLElement, MutationObserver>();

export function registerCloneGhostOnStart(
  el: HTMLElement,
  factory: CloneGhostFactory,
): () => void {
  cloneGhostOnStartRegistrations.set(el, factory);
  return () => {
    cloneGhostOnStartRegistrations.delete(el);
  };
}

export function triggerCloneGhostOnStart(sourceEl: HTMLElement): void {
  const ghost = getGhostEl();
  if (!ghost) return;
  cloneGhostOnStartRegistrations.forEach((factory, destEl) => {
    if (destEl === sourceEl) return;
    const preview = factory();
    if (!preview) return;
    applyIfFresh(ghost, () => preview, destEl);
    if (!(preview instanceof HTMLElement)) return;
    const observer = new MutationObserver(() => {
      ghost.innerHTML = preview.innerHTML;
      const rect = preview.getBoundingClientRect();
      ghost.style.width = `${rect.width}px`;
      ghost.style.height = `${rect.height}px`;
    });
    observer.observe(preview, { childList: true, subtree: true });
    cloneGhostOnStartObservers.set(destEl, observer);
  });
}

function disconnectCloneGhostOnStartObservers(): void {
  cloneGhostOnStartObservers.forEach((o) => o.disconnect());
  cloneGhostOnStartObservers.clear();
}

// Non-global hooks only fire on sortables where `options[pluginName]` is set;
// global hooks fire on every sortable the plugin is initialized on (all of
// them, via `initializeByDefault`). The apply path uses non-global
// `dragOverValid` because we only want to apply on destinations that have
// `cloneGhost` configured. Every restore path uses a `Global` variant
// because restores happen on the source sortable during events like drop,
// nulling, revert, and dragOver-with-isOwner, none of which fire the
// non-global variants on a source that doesn't declare `cloneGhost`.
function CloneGhostPlugin(this: unknown) {}
CloneGhostPlugin.prototype = {
  dragOverValid(args: PluginArgs) {
    if (args.isOwner) return;
    const factory = (
      args.sortable.options as { cloneGhost?: CloneGhostFactory }
    ).cloneGhost;
    if (!factory) return;
    applyIfFresh(getDraggedEl(), factory, args.sortable.el);
    applyIfFresh(getGhostEl(), factory, args.sortable.el);
  },
  dragOverGlobal(args: PluginArgs) {
    if (!args.isOwner) return;
    restoreAll();
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const dragged = getDraggedEl();
    restoreAll();
    if (dragged && dragged.style.display === 'none') {
      dragged.style.display = '';
    }
  },
  dropGlobal() {
    restoreAll();
  },
  nullingGlobal() {
    restoreAll();
    disconnectCloneGhostOnStartObservers();
  },
};
(CloneGhostPlugin as unknown as { pluginName: string }).pluginName =
  'cloneGhost';
(
  CloneGhostPlugin as unknown as { initializeByDefault: boolean }
).initializeByDefault = true;

// ---------------------------------------------------------------------------
// DragStateTracker
//
// Per-sortable `isDragOver` ref plus opt-in `hideOnLeave` display toggle,
// both driven from a single pointermove listener and a single rect check
// per instance. Registration is driven from useDraggable rather than from
// SortableJS's plugin lifecycle because the tracker needs to iterate all
// sortables on every pointermove, and a plugin instance only sees its own.
// ---------------------------------------------------------------------------

interface DragStateRegistration {
  isDragOver: Ref<boolean>;
  getOptions: () => { hideOnLeave?: boolean } | undefined;
}

const dragStateRegistrations = new Map<HTMLElement, DragStateRegistration>();
let dragStatePointerListener: ((evt: PointerEvent) => void) | null = null;

function pointInRect(x: number, y: number, rect: DOMRect): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function installDragStateListener(): void {
  if (dragStatePointerListener) return;
  const listener = (evt: PointerEvent) => {
    const dragged = getDraggedEl();
    dragStateRegistrations.forEach(({ isDragOver, getOptions }, el) => {
      const inside = pointInRect(
        evt.clientX,
        evt.clientY,
        el.getBoundingClientRect(),
      );
      if (isDragOver.value !== inside) {
        isDragOver.value = inside;
        // hideOnLeave only hides drags that originated in another sortable.
        // An in-list reorder exiting its own rect must stay visible, otherwise
        // the item blinks out while the user is mid-reorder.
        const active = (Sortable as unknown as { active: Sortable | null })
          .active;
        if (
          dragged &&
          dragged.parentNode === el &&
          active?.el !== el &&
          getOptions()?.hideOnLeave
        ) {
          dragged.style.display = inside ? '' : 'none';
        }
      }
    });
  };
  document.addEventListener('pointermove', listener);
  dragStatePointerListener = listener;
}

function removeDragStateListener(): void {
  if (!dragStatePointerListener) return;
  document.removeEventListener('pointermove', dragStatePointerListener);
  dragStatePointerListener = null;
}

function resetAllDragStateRefs(): void {
  dragStateRegistrations.forEach(({ isDragOver }) => {
    if (isDragOver.value) {
      isDragOver.value = false;
    }
  });
}

// Registers a sortable with the tracker so its `isDragOver` ref is updated
// during drags. Returns a dispose fn; call from useDraggable's destroy.
export function registerDragStateInstance(
  el: HTMLElement,
  isDragOver: Ref<boolean>,
  getOptions: () => { hideOnLeave?: boolean } | undefined,
): () => void {
  dragStateRegistrations.set(el, { isDragOver, getOptions });
  return () => {
    dragStateRegistrations.delete(el);
  };
}

function DragStateTrackerPlugin(this: unknown) {}
DragStateTrackerPlugin.prototype = {
  dragStartGlobal() {
    installDragStateListener();
  },
  nullingGlobal() {
    removeDragStateListener();
    resetAllDragStateRefs();
    // Clear any lingering display:none from hideOnLeave so dragEl is visible
    // to SortableJS's own drop/revert logic.
    const dragged = getDraggedEl();
    if (dragged && dragged.style.display === 'none') {
      dragged.style.display = '';
    }
  },
};
(DragStateTrackerPlugin as unknown as { pluginName: string }).pluginName =
  'dragStateTracker';
(
  DragStateTrackerPlugin as unknown as { initializeByDefault: boolean }
).initializeByDefault = true;

// ---------------------------------------------------------------------------
// BodyClass
//
// Toggles `body.sortable-dragging` during any active drag so consumers can
// style globally affected things (e.g. `user-select: none`) without
// threading drag state through their component tree.
// ---------------------------------------------------------------------------

const BODY_DRAG_CLASS = 'sortable-dragging';

// Global hooks because BodyClass is always active. It has no option to key
// off, so non-global variants would never fire.
function BodyClassPlugin(this: unknown) {}
BodyClassPlugin.prototype = {
  dragStartGlobal() {
    document.body.classList.add(BODY_DRAG_CLASS);
  },
  nullingGlobal() {
    document.body.classList.remove(BODY_DRAG_CLASS);
  },
};
(BodyClassPlugin as unknown as { pluginName: string }).pluginName = 'bodyClass';
(
  BodyClassPlugin as unknown as { initializeByDefault: boolean }
).initializeByDefault = true;

let mounted = false;

// Mounts CloneGhost, DragStateTracker, and BodyClass on the shared Sortable
// plugin registry. Idempotent; safe to call repeatedly. Called once from
// useDraggable's module initialization, via an explicit call rather than a
// side-effect import so the module isn't tree-shaken under `sideEffects:
// false`.
export function mountDragPlugins(): void {
  if (mounted) return;
  mounted = true;
  Sortable.mount(
    CloneGhostPlugin as never,
    DragStateTrackerPlugin as never,
    BodyClassPlugin as never,
  );
}
