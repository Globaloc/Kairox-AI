import type { InjectionKey, Ref } from "vue";

export interface SidebarContext {
	open: Ref<boolean>;
	setOpen: (value: boolean) => void;
	toggleSidebar: () => void;
}

export const sidebarContextKey = Symbol("sidebar") as InjectionKey<SidebarContext>;
