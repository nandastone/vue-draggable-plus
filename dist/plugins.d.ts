import { type Ref } from 'vue';
export declare function registerDragStateInstance(el: HTMLElement, isDragOver: Ref<boolean>, getOptions: () => {
    hideOnLeave?: boolean;
} | undefined): () => void;
export declare function mountDragPlugins(): void;
