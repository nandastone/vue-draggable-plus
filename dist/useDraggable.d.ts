import Sortable, { type Options, type SortableEvent } from 'sortablejs';
import { type Ref } from 'vue';
import type { RefOrElement, MaybeRef } from './types';
declare const CLONE_ELEMENT_KEY: unique symbol;
export interface DraggableEvent<T = any> extends SortableEvent {
    item: HTMLElement & {
        [CLONE_ELEMENT_KEY]: any;
    };
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
     * Factory for a destination-specific drag preview. When a cross-list drag
     * from another sortable enters this one, the dragged element's innerHTML is
     * replaced with the result of this factory so the user sees the element as
     * it will look once dropped (e.g. a scene card for an app dropped into a
     * playlist). The original innerHTML is restored when the drag leaves this
     * sortable, ends, or cancels. Return `null` to leave the default in place.
     */
    cloneGhost?: () => HTMLElement | string | null;
    /**
     * Hide the dragged element's placeholder while the cursor is outside this
     * sortable's bounding rect. Pairs with `cloneGhost` for a symmetric feel:
     * the destination preview appears on entry and disappears on leave, rather
     * than lingering until drop.
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
export declare function useDraggable<T>(el: RefOrElement, list?: Ref<T[] | undefined>, options?: MaybeRef<UseDraggableOptions<T>>): UseDraggableReturn;
export declare function useDraggable<T>(el: null | undefined, list?: Ref<T[] | undefined>, options?: MaybeRef<UseDraggableOptions<T>>): UseDraggableReturn;
export declare function useDraggable<T>(el: RefOrElement<HTMLElement | null | undefined>, options?: MaybeRef<UseDraggableOptions<T>>): UseDraggableReturn;
export {};
