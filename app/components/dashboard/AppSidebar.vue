<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar"

import {
	Code,
	MessageSquare,
	SquarePen,
	Hash,
	Eraser,
	Scissors,
	FileCheck,
} from "lucide-vue-next"
import NavProjects from "@/components/dashboard/NavProjects.vue"
import NavUser from "@/components/dashboard/NavUser.vue"
import UserCounter from "@/components/dashboard/UserCounter.vue"

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"

const props = withDefaults(defineProps<SidebarProps>(), {
	collapsible: "icon",
})

const { fetchSession, user } = useAuth()
const { t } = useI18n()
const localePath = useLocalePath()

await fetchSession();

const sidebarUser = computed(() => ({
	name: user.value?.name || t("header.account"),
	email: user.value?.email || t("header.signedIn"),
	avatar: user.value?.image || "",
}));

const menuGroups = computed(() => [
		{
			label: t("dashboardNav.workspace"),
			items: [
				{
					title: t("dashboardNav.conversation"),
					url: localePath("/dashboard/conversation"),
					icon: MessageSquare,
				},
				{
					title: t("dashboardNav.codeGeneration"),
					url: localePath("/dashboard/code-generation"),
					icon: Code,
				},
			],
		},
		{
			label: t("dashboardNav.writing"),
			items: [
				{
					title: t("dashboardNav.aiArticleWriter"),
					url: localePath("/dashboard/ai-article-writer"),
					icon: SquarePen,
				},
				{
					title: t("dashboardNav.blogTitleGenerator"),
					url: localePath("/dashboard/blog-title-generator"),
					icon: Hash,
				},
			],
		},
		{
			label: t("dashboardNav.imageTools"),
			items: [
				{
					title: t("dashboardNav.backgroundRemoval"),
					url: localePath("/dashboard/background-removal"),
					icon: Eraser,
				},
				{
					title: t("dashboardNav.objectRemoval"),
					url: localePath("/dashboard/object-removal"),
					icon: Scissors,
				},
			],
		},
		{
			label: t("dashboardNav.review"),
			show: true,
			items: [
				{
					title: t("dashboardNav.resumeReviewer"),
					url: localePath("/dashboard/review-resume"),
					icon: FileCheck,
				},
			],
		},
	])
</script>

<template>
	<Sidebar v-bind="props" class="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
		<SidebarHeader>
			<NavUser :user="sidebarUser" />
		</SidebarHeader>
		<SidebarContent class="gap-0">
			<!-- <NavMain :menu-groups="data.navMain" /> -->
			<NavProjects :menu-groups="menuGroups" />
		</SidebarContent>
		<SidebarFooter class="group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:p-2">
			<UserCounter />
		</SidebarFooter>
		<SidebarRail />
	</Sidebar>
</template>

<style scoped>
</style>
