import Sortable from 'sortablejs';
import { type Ref } from 'vue-demi';

// SortableJS plugins that implement two drag UX concerns in a
// framework-agnostic way, mounted once at module load. Consumers opt in per
// sortable via the `hideOnLeave` option. `BodyClass` and `DragStateTracker`
// initialize by default and run on every drag.

// The element SortableJS is currently dragging. Shared by the plugins below.
function getDraggedEl(): HTMLElement | null {
  return (Sortable as unknown as { dragged: HTMLElement | null }).dragged;
}

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
  // WORKAROUND (unpatched sortablejs): SortableJS ignores `put: false` on the
  // revert-to-origin path (_onDragOver ~line 1748), so dragEl can be moved back
  // into the source while hideOnLeave's display:none is still applied. Clear it
  // before the DOM insert so the reverted item isn't reinserted invisible.
  // Remove once SortableJS respects `put: false` on the owner revert branch.
  // Upstream PR: https://github.com/SortableJS/Sortable/pull/2465
  revertGlobal() {
    const dragged = getDraggedEl();
    if (dragged && dragged.style.display === 'none') {
      dragged.style.display = '';
    }
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

// Mounts DragStateTracker and BodyClass on the shared Sortable plugin
// registry. Idempotent; safe to call repeatedly. Called once from
// useDraggable's module initialization, via an explicit call rather than a
// side-effect import so the module isn't tree-shaken under `sideEffects:
// false`.
export function mountDragPlugins(): void {
  if (mounted) return;
  mounted = true;
  Sortable.mount(DragStateTrackerPlugin as never, BodyClassPlugin as never);
}
