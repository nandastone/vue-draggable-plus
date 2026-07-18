import Sortable, { type Options, type SortableEvent } from 'sortablejs';
import {
  getCurrentInstance,
  isRef,
  onMounted,
  onUnmounted,
  shallowRef,
  unref,
  nextTick,
  watch,
  type Ref,
} from 'vue-demi';
import type { Fn, RefOrElement, MaybeRef } from './types';

import { error } from './utils/log';

import {
  extend,
  forEachObject,
  getElementBySelector,
  insertElement,
  insertNodeAt,
  isHTMLElement,
  isOn,
  isString,
  isUndefined,
  mergeOptionsEvents,
  moveArrayElement,
  removeElement,
  removeNode,
} from './utils';

import { mountDragPlugins, registerDragStateInstance } from './plugins';

mountDragPlugins();

function defaultClone<T>(element: T): T {
  if (element === undefined || element === null) return element;
  return JSON.parse(JSON.stringify(element));
}

/**
 * copied from vueuse: https://github.com/vueuse/vueuse/blob/main/packages/shared/tryOnUnmounted/index.ts
 * Call onUnmounted() if it's inside a component lifecycle, if not, do nothing
 * @param fn
 */
function tryOnUnmounted(fn: Fn) {
  if (getCurrentInstance()) onUnmounted(fn);
}

/**
 * copied from vueuse:https://github.com/vueuse/vueuse/blob/main/packages/shared/tryOnMounted/index.ts
 * Call onMounted() if it's inside a component lifecycle, if not, just call the function
 * @param fn
 */
function tryOnMounted(fn: Fn) {
  if (getCurrentInstance()) onMounted(fn);
  else nextTick(fn);
}

let data: any = null;
let clonedData: any = null;

// Reactive mirror of the currently-dragged source data. Non-null while a
// drag is in progress, null otherwise. Exposed to consumers via the
// useDraggable return as `draggedData` so destination sortables can render
// a preview from the source without needing their own shared store.
const currentDraggedData = shallowRef<unknown>(null);

function setCurrentData(
  _data: typeof data = null,
  _clonedData: typeof data = null,
) {
  data = _data;
  clonedData = _clonedData;
  currentDraggedData.value = _clonedData;
}

function getCurrentData() {
  return {
    data,
    clonedData,
  };
}

const CLONE_ELEMENT_KEY = Symbol('cloneElement');

export interface DraggableEvent<T = any> extends SortableEvent {
  item: HTMLElement & { [CLONE_ELEMENT_KEY]: any };
  data: T;
  clonedData: T;
}
type SortableMethod = 'closest' | 'save' | 'toArray' | 'destroy' | 'option';

export interface UseDraggableReturn extends Pick<Sortable, SortableMethod> {
  /**
   * Start the sortable.
   * @param {HTMLElement} target - The target element to be sorted.
   * @default By default the root element of the VueDraggablePlus instance is used
   */
  start: (target?: HTMLElement) => void;
  pause: () => void;
  resume: () => void;
  /**
   * Reactive reference to the source data of whatever drag is currently in
   * progress. Non-null while any sortable is actively dragging, null
   * otherwise. Shared across all sortable instances. Useful for rendering a
   * destination-specific preview without plumbing the source data through
   * external shared state.
   */
  draggedData: Ref<unknown>;
  /**
   * Reactive reference to whether the cursor is currently within this
   * sortable's bounding rect during a drag. Resets to false when the drag
   * ends. Useful for destination-specific UI that should only appear while
   * the user is actively aiming at this list — e.g. an empty-state drop
   * zone overlay hidden on hover, distinct from the global
   * `body.sortable-dragging` state.
   */
  isDragOver: Ref<boolean>;
}

export interface UseDraggableOptions<T> extends Options {
  clone?: (element: T) => T;
  immediate?: boolean;
  customUpdate?: (event: DraggableEvent<T>) => void;
  /**
   * Hide the dragged element's placeholder while the cursor is outside this
   * sortable's bounding rect, so it disappears on leave rather than lingering
   * until drop.
   */
  hideOnLeave?: boolean;
  /**
   * Element dragging started
   */
  onStart?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Element dragging ended
   */
  onEnd?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Element is dropped into the list from another list.
   *
   * Runs BEFORE the library's default list insertion. Return `false` to
   * cancel that insertion entirely — useful for heterogeneous cross-list
   * drops where the consumer takes over (e.g. source is `App[]`, destination
   * is `Scene[]`, and the real insertion happens via a server mutation).
   * Any other return value (including `undefined`) lets the library insert
   * the cloned source data into the destination list as normal.
   */
  onAdd?: ((event: DraggableEvent<T>) => boolean | void) | undefined;
  /**
   * Created a clone of an element
   */
  onClone?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Element is chosen
   */
  onChoose?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Element is unchosen
   */
  onUnchoose?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Changed sorting within list
   */
  onUpdate?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Called by any change to the list (add / update / remove)
   */
  onSort?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Element is removed from the list into another list
   */
  onRemove?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Attempt to drag a filtered element
   */
  onFilter?: ((event: DraggableEvent<T>) => void) | undefined;
  /**
   * Called when dragging element changes position
   */
  onChange?: ((evt: DraggableEvent<T>) => void) | undefined;
}

/**
 * A custom compositionApi utils that allows you to drag and drop elements in lists.
 * @param el
 * @param {Array} list - The list to be dragged
 * @param {Object} options - The options of the sortable
 * @returns {Object} - The return of the sortable
 */
export function useDraggable<T>(
  el: RefOrElement,
  list?: Ref<T[] | undefined>,
  options?: MaybeRef<UseDraggableOptions<T>>,
): UseDraggableReturn;
export function useDraggable<T>(
  el: null | undefined,
  list?: Ref<T[] | undefined>,
  options?: MaybeRef<UseDraggableOptions<T>>,
): UseDraggableReturn;
export function useDraggable<T>(
  el: RefOrElement<HTMLElement | null | undefined>,
  options?: MaybeRef<UseDraggableOptions<T>>,
): UseDraggableReturn;

/**
 * A custom compositionApi utils that allows you to drag and drop elements in lists.
 * @param {Ref<HTMLElement | null | undefined> | string} el
 * @param {Ref<T[]>} list
 * @param {MaybeRef<UseDraggableOptions<T>>} options
 * @returns {UseSortableReturn}
 */
export function useDraggable<T>(...args: any[]): UseDraggableReturn {
  const vm = getCurrentInstance()?.proxy;
  let currentNodes: Node[] | null = null;
  const el = args[0];
  let [, list, options] = args;

  if (!Array.isArray(unref(list))) {
    options = list;
    list = null;
  }

  let instance: Sortable | null = null;
  // The ref outlives any given Sortable instance so consumers can read it
  // before start() runs (e.g. `immediate: false`) and across re-starts.
  let dragStateDispose: (() => void) | null = null;
  const isDragOver = shallowRef(false);
  const {
    immediate = true,
    clone = defaultClone,
    forceFallback,
    fallbackOnBody,
    customUpdate,
  } = unref(options) ?? {};

  /**
   * Element dragging started
   * @param {DraggableEvent} evt - DraggableEvent
   */
  function onStart(evt: DraggableEvent) {
    const { from, oldIndex, item } = evt;
    const nodes = Array.from(from.childNodes);
    currentNodes =
      forceFallback && !fallbackOnBody ? nodes.slice(0, -1) : nodes;
    const data = unref(unref(list)?.[oldIndex!]);
    const clonedData = clone(data);
    setCurrentData(data, clonedData);
    item[CLONE_ELEMENT_KEY] = clonedData;
  }

  /**
   * Element is dropped into the list from another list. Inserts the cloned
   * source data into the destination's reactive list. Gated by the user's
   * onAdd returning something other than `false` (see mergeOptions).
   */
  function onAdd(evt: DraggableEvent) {
    const element = evt.item[CLONE_ELEMENT_KEY];
    if (isUndefined(element)) return;
    removeNode(evt.item);
    if (isRef<any[]>(list)) {
      const newList = [...unref(list)];
      list.value = insertElement(newList, evt.newDraggableIndex!, element);
      return;
    }
    insertElement(unref(list), evt.newDraggableIndex!, element);
  }

  /**
   * Element is removed from the list into another list
   * @param {DraggableEvent} evt
   */
  function onRemove(evt: DraggableEvent) {
    const { from, item, oldIndex, oldDraggableIndex, pullMode, clone } = evt;
    insertNodeAt(from, item, oldIndex!);
    if (pullMode === 'clone') {
      removeNode(clone);
      return;
    }
    if (isRef<any[]>(list)) {
      const newList = [...unref(list)];
      list.value = removeElement(newList, oldDraggableIndex!);
      return;
    }
    removeElement(unref(list), oldDraggableIndex!);
  }

  /**
   * Changed sorting within list
   * @param {DraggableEvent} evt
   */
  function onUpdate(evt: DraggableEvent) {
    if (customUpdate) {
      customUpdate(evt);
      return;
    }
    const { from, item, oldIndex, oldDraggableIndex, newDraggableIndex } = evt;
    removeNode(item);
    insertNodeAt(from, item, oldIndex!);
    if (isRef<any[]>(list)) {
      const newList = [...unref(list)];
      list.value = moveArrayElement(
        newList,
        oldDraggableIndex!,
        newDraggableIndex!,
      );
      return;
    }
    moveArrayElement(unref(list), oldDraggableIndex!, newDraggableIndex!);
  }

  function onEnd(e: DraggableEvent) {
    const { newIndex, oldIndex, from, to } = e;
    let error: Error | null = null;
    const isSameIndex = newIndex === oldIndex && from === to;
    try {
      //region #202
      if (isSameIndex) {
        let oldNode: Node | null = null;
        currentNodes?.some((node, index) => {
          if (oldNode && currentNodes?.length !== to.childNodes.length) {
            from.insertBefore(oldNode, node.nextSibling);
            return true;
          }
          const _node = to.childNodes[index];
          oldNode = to?.replaceChild(node, _node);
        });
      }
      //endregion
    } catch (e) {
      error = e;
    } finally {
      currentNodes = null;
    }
    nextTick(() => {
      setCurrentData();
      if (error) throw error;
    });
  }

  /**
   * preset options
   */
  const presetOptions: UseDraggableOptions<T> = {
    onUpdate,
    onStart,
    onAdd,
    onRemove,
    onEnd,
  };

  function getTarget(target?: HTMLElement) {
    const element = unref(el) as any;
    if (!target) {
      target = isString(element)
        ? getElementBySelector(element, vm?.$el)
        : element;
    }
    // @ts-ignore
    if (target && !isHTMLElement(target)) target = target.$el;

    if (!target) error('Root element not found');
    return target;
  }

  function mergeOptions() {
    // eslint-disable-next-line
    const { immediate, clone, ...restOptions } = unref(options) ?? {};

    forEachObject(restOptions, (key, fn) => {
      if (!isOn(key)) return;
      restOptions[key] = (evt: DraggableEvent, ...args: any[]) => {
        const data = getCurrentData();
        extend(evt, data);
        return fn(evt, ...args);
      };
    });

    // Pull user's onAdd out of the default merge so we can build a single
    // wrapper with explicit control flow:
    //   (1) If dragEl is hidden at drop time (e.g. the HideOnLeave plugin
    //       parked it because the cursor was outside this sortable at
    //       release), skip the drop entirely. This is a general "dragEl is
    //       not visibly here" policy, not specific to any plugin.
    //   (2) User handler runs first; returning `false` cancels (3).
    //   (3) Preset auto-insert into the reactive list.
    const userOnAdd = restOptions.onAdd as
      | ((evt: DraggableEvent) => boolean | void)
      | undefined;
    delete restOptions.onAdd;

    const effectivePresets = list === null ? {} : presetOptions;
    const merged = mergeOptionsEvents(effectivePresets, restOptions) as Options;

    const presetOnAdd = (effectivePresets as UseDraggableOptions<T>).onAdd as
      | ((evt: DraggableEvent) => void)
      | undefined;

    if (userOnAdd || presetOnAdd) {
      merged.onAdd = function (evt: SortableEvent) {
        if (evt.item?.style.display === 'none') {
          return;
        }
        const result = userOnAdd?.call(this, evt as DraggableEvent);
        if (result !== false) {
          presetOnAdd?.call(this, evt as DraggableEvent);
        }
      };
    }

    return merged;
  }

  const start = (target?: HTMLElement) => {
    target = getTarget(target);
    if (instance) methods.destroy();

    instance = new Sortable(target as HTMLElement, mergeOptions());
    dragStateDispose = registerDragStateInstance(
      target as HTMLElement,
      isDragOver,
      () => unref(options),
    );
  };

  watch(
    () => options,
    () => {
      if (!instance) return;
      forEachObject(mergeOptions(), (key, value) => {
        // @ts-ignore
        instance?.option(key, value);
      });
    },
    { deep: true },
  );

  const methods = {
    option: (name: keyof Options, value?: any) => {
      // @ts-ignore
      return instance?.option(name, value);
    },
    destroy: () => {
      dragStateDispose?.();
      dragStateDispose = null;
      instance?.destroy();
      instance = null;
    },
    save: () => instance?.save(),
    toArray: () => instance?.toArray(),
    closest: (...args) => {
      // @ts-ignore
      return instance?.closest(...args);
    },
  } as Pick<Sortable, SortableMethod>;

  const pause = () => methods?.option('disabled', true);
  const resume = () => methods?.option('disabled', false);

  tryOnMounted(() => {
    immediate && start();
  });

  tryOnUnmounted(methods.destroy);

  return {
    start,
    pause,
    resume,
    ...methods,
    draggedData: currentDraggedData,
    isDragOver,
  };
}
