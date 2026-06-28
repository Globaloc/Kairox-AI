<script setup lang="ts">
import {
	ArrowUpRight,
	CheckCircle2,
	Code,
	Eraser,
	FileCheck,
	Hash,
	Image,
	MessageSquare,
	Scissors,
	Sparkles,
	SquarePen,
	WandSparkles,
} from "lucide-vue-next"

definePageMeta({
	layout: "dashboard",
})

useHead({
	title: "AI tools - Kairox AI",
	meta: [
		{
			name: "description",
			content: "Choose an AI tool in Kairox AI to write, code, edit images, or review a resume.",
		},
	],
})

const { t, tm, rt } = useI18n()
const localePath = useLocalePath()

const featuredTools = computed(() => [
	{
		title: t("dashboardNav.conversation"),
		description: t("dashboardHome.tools.conversation.description"),
		category: t("dashboardNav.workspace"),
		status: t("dashboardHome.tools.conversation.status"),
		url: localePath("/dashboard/conversation"),
		icon: MessageSquare,
		accent: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-300",
	},
	{
		title: t("dashboardNav.codeGeneration"),
		description: t("dashboardHome.tools.code.description"),
		category: t("dashboardNav.workspace"),
		status: t("dashboardHome.tools.code.status"),
		url: localePath("/dashboard/code-generation"),
		icon: Code,
		accent: "bg-sky-500/12 text-sky-600 dark:text-sky-300",
	},
	{
		title: t("dashboardNav.aiArticleWriter"),
		description: t("dashboardHome.tools.article.description"),
		category: t("dashboardNav.writing"),
		status: t("dashboardHome.tools.article.status"),
		url: localePath("/dashboard/ai-article-writer"),
		icon: SquarePen,
		accent: "bg-violet-500/12 text-violet-600 dark:text-violet-300",
	},
	{
		title: t("dashboardNav.blogTitleGenerator"),
		description: t("dashboardHome.tools.blog.description"),
		category: t("dashboardNav.writing"),
		status: t("dashboardHome.tools.blog.status"),
		url: localePath("/dashboard/blog-title-generator"),
		icon: Hash,
		accent: "bg-amber-500/12 text-amber-700 dark:text-amber-300",
	},
	{
		title: t("dashboardNav.backgroundRemoval"),
		description: t("dashboardHome.tools.background.description"),
		category: t("dashboardNav.imageTools"),
		status: t("dashboardHome.tools.background.status"),
		url: localePath("/dashboard/background-removal"),
		icon: Eraser,
		accent: "bg-teal-500/12 text-teal-700 dark:text-teal-300",
	},
	{
		title: t("dashboardNav.objectRemoval"),
		description: t("dashboardHome.tools.object.description"),
		category: t("dashboardNav.imageTools"),
		status: t("dashboardHome.tools.object.status"),
		url: localePath("/dashboard/object-removal"),
		icon: Scissors,
		accent: "bg-rose-500/12 text-rose-600 dark:text-rose-300",
	},
	{
		title: t("dashboardNav.resumeReviewer"),
		description: t("dashboardHome.tools.resume.description"),
		category: t("dashboardNav.review"),
		status: t("dashboardHome.tools.resume.status"),
		url: localePath("/dashboard/review-resume"),
		icon: FileCheck,
		accent: "bg-lime-500/12 text-lime-700 dark:text-lime-300",
	},
])

const quickSteps = computed(() => tm("dashboardHome.steps") as string[])
</script>

<template>
	<main class="min-h-[calc(100svh-var(--header-height))] bg-background">
		<div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
			<section class="relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70 sm:p-8 lg:p-10">
				<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_82%_18%,hsl(var(--muted-foreground)/0.10),transparent_28%)]" />
				<div class="relative grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-end">
					<div class="max-w-3xl">
						<div class="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
							<Sparkles class="size-4" />
							{{ t("dashboardHome.badge") }}
						</div>
						<h1 class="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
							{{ t("dashboardHome.title") }}
						</h1>
						<p class="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
							{{ t("dashboardHome.description") }}
						</p>
						<div class="mt-6 flex flex-col gap-3 sm:flex-row">
							<Button as-child class="h-11 shadow-lg shadow-primary/20 active:scale-[0.98]">
								<NuxtLink :to="localePath('/dashboard/conversation')">
									<WandSparkles class="size-4" />
									{{ t("dashboardHome.startConversation") }}
								</NuxtLink>
							</Button>
							<Button variant="outline" class="h-11 active:scale-[0.98]">
								{{ t("dashboardHome.browseTools") }}
								<ArrowUpRight class="size-4" />
							</Button>
						</div>
					</div>

					<aside class="rounded-xl bg-background/80 p-5 ring-1 ring-border/70 backdrop-blur">
						<div class="flex items-center gap-3">
							<div class="grid size-11 place-items-center rounded-lg bg-primary/12 text-primary">
								<Image class="size-5" />
							</div>
							<div>
								<p class="font-semibold">{{ t("dashboardHome.ready") }}</p>
								<p class="text-sm text-muted-foreground">{{ t("dashboardHome.focusedTools") }}</p>
							</div>
						</div>
						<div class="mt-5 space-y-3">
							<div v-for="step in quickSteps" :key="step" class="flex gap-3 text-sm leading-6">
								<CheckCircle2 class="mt-0.5 size-4 shrink-0 text-primary" />
								<span class="text-muted-foreground">{{ rt(step) }}</span>
							</div>
						</div>
					</aside>
				</div>
			</section>

			<section aria-labelledby="tools-heading" class="space-y-5">
				<div class="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p class="text-sm font-medium text-primary">{{ t("dashboardHome.library") }}</p>
						<h2 id="tools-heading" class="text-2xl font-semibold tracking-tight">
							{{ t("dashboardHome.workflows") }}
						</h2>
					</div>
					<p class="max-w-xl text-sm leading-6 text-muted-foreground">
						{{ t("dashboardHome.libraryDescription") }}
					</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					<article
						v-for="tool in featuredTools"
						:key="tool.title"
						class="group flex min-h-56 flex-col rounded-xl bg-card p-5 shadow-sm shadow-primary/5 ring-1 ring-border/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="grid size-11 place-items-center rounded-lg" :class="tool.accent">
								<component :is="tool.icon" class="size-5" />
							</div>
							<span class="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
								{{ tool.category }}
							</span>
						</div>

						<div class="mt-5 flex flex-1 flex-col">
							<div>
								<p class="text-xs font-medium text-muted-foreground">{{ tool.status }}</p>
								<h3 class="mt-2 text-xl font-semibold tracking-tight">{{ tool.title }}</h3>
								<p class="mt-3 text-pretty text-sm leading-6 text-muted-foreground">
									{{ tool.description }}
								</p>
							</div>
								<NuxtLink :to="tool.url" class="mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
									{{ t("dashboardHome.openTool") }}
									<ArrowUpRight class="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</NuxtLink>
						</div>
					</article>
				</div>
			</section>
		</div>
	</main>
</template>
