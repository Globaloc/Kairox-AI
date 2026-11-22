<script setup lang="ts">
import { Separator } from "@/components/ui/separator"

const { t } = useI18n()
const localePath = useLocalePath()
const year = new Date().getFullYear()

const columns = computed(() => [
	{
		title: t("footer.product"),
		links: [
			{ label: t("footer.links.features"), to: localePath({ path: "/", hash: "#features" }) },
			{ label: t("footer.links.pricing"), to: localePath({ path: "/", hash: "#pricing" }) },
			{ label: t("footer.links.dashboard"), to: localePath("/dashboard") },
		],
	},
	{
		title: t("footer.tools"),
		links: [
			{ label: t("footer.links.code"), to: localePath("/dashboard/code-generation") },
			{ label: t("footer.links.articles"), to: localePath("/dashboard/ai-article-writer") },
			{ label: t("footer.links.images"), to: localePath("/dashboard/background-removal") },
		],
	},
	{
		title: t("footer.account"),
		links: [
			{ label: t("footer.links.login"), to: localePath("/auth/login") },
			{ label: t("footer.links.register"), to: localePath("/auth/register") },
		],
	},
])
</script>

<template>
	<footer class="border-t border-border/60">
		<div class="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
			<div class="grid gap-10 md:grid-cols-[1.6fr_repeat(3,minmax(0,0.7fr))]">
				<div class="flex flex-col gap-3">
					<NuxtLink :to="localePath('/')" class="flex w-fit items-center gap-2.5 select-none">
						<span class="grid size-8 place-items-center rounded-lg bg-primary text-xs font-extrabold text-primary-foreground">
							K
						</span>
						<span class="text-base font-extrabold tracking-tight text-foreground">Kairox AI</span>
					</NuxtLink>
					<p class="max-w-xs text-sm leading-6 text-muted-foreground">
						{{ t("footer.tagline") }}
					</p>
				</div>

				<div v-for="column in columns" :key="column.title" class="flex flex-col gap-3">
					<p class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						{{ column.title }}
					</p>
					<ul class="flex flex-col gap-2">
						<li v-for="link in column.links" :key="link.label">
							<NuxtLink
								:to="link.to"
								class="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
							>
								{{ link.label }}
							</NuxtLink>
						</li>
					</ul>
				</div>
			</div>

			<Separator class="my-8" />

			<div class="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
				<p>{{ t("footer.rights", { year }) }}</p>
				<p>{{ t("footer.builtWith") }}</p>
			</div>
		</div>
	</footer>
</template>
