import { type Ref } from 'vue';
type CloneGhostFactory = () => HTMLElement | string | null;
export declare function registerCloneGhostOnStart(el: HTMLElement, getFactory: () => CloneGhostFactory | undefined): () => void;
export declare function triggerCloneGhostOnStart(sourceEl: HTMLElement): void;
export declare function hideGhostForCloneGhostOnStart(sourceEl: HTMLElement): void;
export declare function registerDragStateInstance(el: HTMLElement, isDragOver: Ref<boolean>, getOptions: () => {
    hideOnLeave?: boolean;
} | undefined): () => void;
export declare function mountDragPlugins(): void;
export {};
