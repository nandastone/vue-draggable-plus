import { type Ref } from 'vue';
export declare function registerDragStateInstance(el: HTMLElement, isDragOver: Ref<boolean>, getOptions: () => {
    hideOnLeave?: boolean;
} | undefined): {
    dispose: () => void;
};
export declare function createDragStateRef(): Ref<boolean>;
export declare function mountDragPlugins(): void;
