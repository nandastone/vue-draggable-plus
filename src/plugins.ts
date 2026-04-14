import Sortable from 'sortablejs';
import { shallowRef, type Ref } from 'vue-demi';

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
const CLONE_GHOST_APPLIED_BY = Symbol('cloneGhostAppliedBy');

type CloneGhostFactory = () => HTMLElement | string | null;

type CloneGhostDragEl = HTMLElement & {
  [CLONE_GHOST_ORIGINAL_HTML]?: string;
  [CLONE_GHOST_APPLIED_BY]?: HTMLElement;
};

function getDraggedEl(): CloneGhostDragEl | null {
  return (Sortable as unknown as { dragged: HTMLElement | null })
    .dragged as CloneGhostDragEl | null;
}

function restoreCloneGhost(el: CloneGhostDragEl | null): void {
  if (!el || !el[CLONE_GHOST_APPLIED_BY]) return;
  const original = el[CLONE_GHOST_ORIGINAL_HTML];
  if (typeof original === 'string') {
    el.innerHTML = original;
  }
  el[CLONE_GHOST_ORIGINAL_HTML] = undefined;
  el[CLONE_GHOST_APPLIED_BY] = undefined;
}

function applyCloneGhost(
  el: CloneGhostDragEl,
  factory: CloneGhostFactory,
  appliedBy: HTMLElement,
): void {
  const preview = factory();
  if (!preview) return;
  el[CLONE_GHOST_ORIGINAL_HTML] = el.innerHTML;
  el.innerHTML = typeof preview === 'string' ? preview : preview.innerHTML;
  el[CLONE_GHOST_APPLIED_BY] = appliedBy;
}

// Non-global hooks only fire on sortables where `options[pluginName]` is set;
// global hooks fire on every sortable the plugin is initialized on (all of
// them, via `initializeByDefault`). The apply path uses non-global
// `dragOverValid` because we only want to apply on destinations that have
// `cloneGhost` configured. Every restore path uses a `Global` variant
// because restores happen on the source sortable during events like drop,
// nulling, revert, and dragOver-with-isOwner — none of which fire the
// non-global variants on a source that doesn't declare `cloneGhost`.
function CloneGhostPlugin(this: unknown) {}
CloneGhostPlugin.prototype = {
  dragOverValid(args: PluginArgs) {
    if (args.isOwner) return;
    const factory = (
      args.sortable.options as { cloneGhost?: CloneGhostFactory }
    ).cloneGhost;
    if (!factory) return;
    const dragged = getDraggedEl();
    if (!dragged) return;
    if (dragged[CLONE_GHOST_APPLIED_BY] === args.sortable.el) return;
    if (dragged[CLONE_GHOST_APPLIED_BY]) {
      restoreCloneGhost(dragged);
    }
    applyCloneGhost(dragged, factory, args.sortable.el);
  },
  dragOverGlobal(args: PluginArgs) {
    if (!args.isOwner) return;
    restoreCloneGhost(getDraggedEl());
  },
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on
  // the revert-to-origin path (_onDragOver ~line 1748), so dragEl can be
  // moved back into the source while cloneGhost and hideOnLeave state are
  // still applied. This hook restores both before the DOM insert.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const dragged = getDraggedEl();
    restoreCloneGhost(dragged);
    if (dragged && dragged.style.display === 'none') {
      dragged.style.display = '';
    }
  },
  dropGlobal() {
    restoreCloneGhost(getDraggedEl());
  },
  nullingGlobal() {
    restoreCloneGhost(getDraggedEl());
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
// Maintains a per-sortable `isDragOver` ref that reflects whether the cursor
// is currently within that sortable's bounding rect during a drag. One global
// pointermove listener is installed on drag start and torn down on nulling;
// it iterates all registered sortables and updates their refs in place.
//
// `hideOnLeave` is implemented as an opt-in behavior on the same pass: when
// the sortable that owns dragEl has `hideOnLeave: true`, the listener toggles
// `dragEl.style.display` based on the same inside/outside check. This keeps
// both features driven by a single listener and a single rect evaluation per
// instance per pointermove.
//
// Registration is driven from useDraggable (see `registerDragStateInstance`)
// rather than from SortableJS's plugin lifecycle because the tracker needs
// to iterate ALL sortables on every pointermove, not just the one owning
// dragEl — a plugin instance only sees its own sortable.
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
    const dragged = (Sortable as unknown as { dragged: HTMLElement | null })
      .dragged;
    dragStateRegistrations.forEach(({ isDragOver, getOptions }, el) => {
      const inside = pointInRect(
        evt.clientX,
        evt.clientY,
        el.getBoundingClientRect(),
      );
      if (isDragOver.value !== inside) {
        isDragOver.value = inside;
        // Only the sortable currently owning dragEl participates in the
        // hideOnLeave display toggle, and only if it opted in.
        if (
          dragged &&
          dragged.parentNode === el &&
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

// Registers a sortable element with the tracker so its `isDragOver` ref is
// updated during drags. Returned from useDraggable on each successful start
// and disposed on destroy.
export function registerDragStateInstance(
  el: HTMLElement,
  isDragOver: Ref<boolean>,
  getOptions: () => { hideOnLeave?: boolean } | undefined,
): { dispose: () => void } {
  dragStateRegistrations.set(el, { isDragOver, getOptions });
  return {
    dispose: () => {
      dragStateRegistrations.delete(el);
    },
  };
}

export function createDragStateRef(): Ref<boolean> {
  return shallowRef(false);
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
    const dragged = (Sortable as unknown as { dragged: HTMLElement | null })
      .dragged;
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

// Global hooks because BodyClass is always active — it has no option to
// key off, so non-global variants would never fire.
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
// useDraggable's module initialization — via an explicit call rather than a
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
