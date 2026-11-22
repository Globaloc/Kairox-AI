<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { LucideIcon } from "lucide-vue-next";
import {
	ArrowRight,
	ArrowUpRight,
	Check,
	ChevronDown,
	Code2,
	Copy,
	Eraser,
	FileCheck,
	Hash,
	Image as ImageIcon,
	MessagesSquare,
	Scissors,
	Sparkles,
	SquarePen,
	Terminal,
	Zap,
} from "lucide-vue-next";

const { t } = useI18n();
const localePath = useLocalePath();

type DemoTab = "code" | "writer" | "resume" | "image";

const activeDemoTab = ref<DemoTab>("code");
const isCopied = ref(false);

const demoTabs = computed(() => [
	{ id: "code" as const, label: t("landing.demo.tabs.code"), icon: Code2 },
	{ id: "writer" as const, label: t("landing.demo.tabs.article"), icon: SquarePen },
	{ id: "resume" as const, label: t("landing.demo.tabs.resume"), icon: FileCheck },
	{ id: "image" as const, label: t("landing.demo.tabs.image"), icon: ImageIcon },
]);

const demoCode = `// composables/useAiChat.ts
export const useAiChat = () => {
  const messages = ref<Message[]>([])
  const isGenerating = ref(false)

  const ask = async (prompt: string) => {
    messages.value.push({ role: 'user', content: prompt })
    isGenerating.value = true

    const reply = await $fetch<string>('/api/ai-tools/conversation', {
      method: 'POST',
      body: { messages: messages.value }
    })

    messages.value.push({ role: 'assistant', content: reply })
    isGenerating.value = false
  }

  return { messages, ask, isGenerating }
}`;

const demoModels: Record<DemoTab, string> = {
	code: "gemini-2.5-flash-lite",
	writer: "gemini-2.5-flash-lite",
	resume: "gemini-2.5-flash-lite",
	image: "Cloudinary AI",
};

const currentDemo = computed(() => ({
	prompt: t(`landing.demo.prompts.${activeDemoTab.value}`),
	model: demoModels[activeDemoTab.value],
}));

const articleSections = computed(() => [
	t("landing.demo.article.sections.intro"),
	t("landing.demo.article.sections.body"),
	t("landing.demo.article.sections.outro"),
]);

function copyCode(text?: string) {
	if (!text) return;
	navigator.clipboard.writeText(text);
	isCopied.value = true;
	setTimeout(() => {
		isCopied.value = false;
	}, 2000);
}

useHead(() => ({
	title: `Kairox AI — ${t("landing.title.first")} ${t("landing.title.second")}`,
	meta: [
		{
			name: "description",
			content: t("landing.description"),
		},
	],
}));

const stats = computed(() => [
	{ label: t("landing.stats.tools"), value: "7" },
	{ label: t("landing.stats.requests"), value: "5" },
	{ label: t("landing.stats.upload"), value: "2 MB" },
]);

type LandingTool = {
	key: "code" | "conversation" | "article" | "blog" | "resume" | "background" | "object";
	category: "code" | "writing" | "review" | "images";
	icon: LucideIcon;
	href: string;
	span?: string;
	preview?: "code" | "image";
};

const toolItems: LandingTool[] = [
	{ key: "code", category: "code", icon: Code2, href: "/dashboard/code-generation", span: "lg:col-span-2", preview: "code" },
	{ key: "conversation", category: "code", icon: MessagesSquare, href: "/dashboard/conversation" },
	{ key: "article", category: "writing", icon: SquarePen, href: "/dashboard/ai-article-writer" },
	{ key: "blog", category: "writing", icon: Hash, href: "/dashboard/blog-title-generator" },
	{ key: "resume", category: "review", icon: FileCheck, href: "/dashboard/review-resume" },
	{ key: "background", category: "images", icon: Eraser, href: "/dashboard/background-removal", span: "lg:col-span-2", preview: "image" },
	{ key: "object", category: "images", icon: Scissors, href: "/dashboard/object-removal" },
];

const tools = computed(() =>
	toolItems.map((tool) => ({
		...tool,
		title: t(`landing.tools.items.${tool.key}.title`),
		category: t(`landing.tools.categories.${tool.category}`),
		description: t(`landing.tools.items.${tool.key}.description`),
	})),
);

const steps = computed(() => [
	{
		number: "01",
		title: t("landing.how.steps.account.title"),
		description: t("landing.how.steps.account.description"),
	},
	{
		number: "02",
		title: t("landing.how.steps.tool.title"),
		description: t("landing.how.steps.tool.description"),
	},
	{
		number: "03",
		title: t("landing.how.steps.result.title"),
		description: t("landing.how.steps.result.description"),
	},
]);

function translatedList(key: string, length: number) {
	return Array.from({ length }, (_, index) => t(`${key}.${index}`));
}

const pricing = computed(() => [
	{
		name: t("landing.pricing.plans.free.name"),
		price: t("landing.pricing.plans.free.price"),
		period: t("landing.pricing.plans.free.period"),
		description: t("landing.pricing.plans.free.description"),
		items: translatedList("landing.pricing.plans.free.items", 4),
		cta: t("landing.pricing.plans.free.cta"),
		featured: false,
	},
	{
		name: t("landing.pricing.plans.pro.name"),
		price: t("landing.pricing.plans.pro.price"),
		period: t("landing.pricing.plans.pro.period"),
		description: t("landing.pricing.plans.pro.description"),
		items: translatedList("landing.pricing.plans.pro.items", 4),
		cta: t("landing.pricing.plans.pro.cta"),
		featured: true,
	},
]);

const faq = computed(() =>
	Array.from({ length: 5 }, (_, index) => ({
		question: t(`landing.faq.items.${index}.question`),
		answer: t(`landing.faq.items.${index}.answer`),
	})),
);
</script>

<template>
	<div class="w-full">
		<!-- HERO -->
		<section class="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
			<div class="flex flex-col gap-6">
				<Badge variant="outline" class="w-fit gap-2 border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
					<Sparkles class="size-3.5" />
					{{ t("landing.badge") }}
				</Badge>

				<h1 class="max-w-2xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
					{{ t("landing.title.first") }}<br />
					<span class="text-primary">{{ t("landing.title.second") }}</span>
				</h1>

				<p class="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
					{{ t("landing.description") }}
				</p>

				<div class="flex flex-col gap-3 sm:flex-row">
					<Button as-child size="lg" class="h-12 px-6 shadow-xl shadow-primary/25 active:scale-[0.98]">
						<NuxtLink :to="localePath('/dashboard')">
							{{ t("landing.cta.primary") }}
							<ArrowRight class="size-4" />
						</NuxtLink>
					</Button>
					<Button as-child variant="outline" size="lg" class="h-12 border-border/80 px-6 active:scale-[0.98]">
						<a href="#features">
							{{ t("landing.cta.secondary") }}
						</a>
					</Button>
				</div>

				<div class="grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
					<div v-for="item in stats" :key="item.label" class="rounded-xl bg-card/70 p-4 ring-1 ring-border/70 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:ring-primary/40">
						<p class="font-mono text-2xl font-bold text-foreground">{{ item.value }}</p>
						<p class="mt-1 text-xs font-medium leading-snug text-muted-foreground">{{ item.label }}</p>
					</div>
				</div>
			</div>

			<div class="relative w-full">
				<div class="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-linear-to-tr from-primary/20 via-chart-2/10 to-transparent blur-3xl" />

				<Card class="relative overflow-hidden rounded-2xl border-border/80 bg-card/90 shadow-2xl shadow-primary/10 backdrop-blur-xl">
					<CardContent class="p-0">
						<!-- Window header -->
						<div class="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/40 px-4 py-3">
							<div class="flex items-center gap-2">
								<span class="size-2.5 rounded-full bg-muted-foreground/30" />
								<span class="size-2.5 rounded-full bg-muted-foreground/30" />
								<span class="size-2.5 rounded-full bg-muted-foreground/30" />
								<span class="ml-2 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
									<Terminal class="size-3 text-primary" />
									{{ t("landing.demo.address") }}
								</span>
							</div>
							<Badge variant="outline" class="border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary">
								{{ t("landing.demo.live") }}
							</Badge>
						</div>

						<!-- Tabs -->
						<div class="grid grid-cols-4 gap-1 border-b border-border/70 bg-background/50 p-1.5 text-xs">
							<button
								v-for="tab in demoTabs"
								:key="tab.id"
								type="button"
								:aria-pressed="activeDemoTab === tab.id"
								class="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
								:class="activeDemoTab === tab.id ? 'bg-primary font-semibold text-primary-foreground shadow-sm shadow-primary/20' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'"
								@click="activeDemoTab = tab.id"
							>
								<component :is="tab.icon" class="size-3.5" />
								<span class="hidden sm:inline">{{ tab.label }}</span>
							</button>
						</div>

						<div class="flex min-h-88 flex-col gap-4 p-5">
							<!-- Prompt bar -->
							<div class="flex items-center gap-2.5 rounded-lg border border-border/70 bg-muted/40 px-3.5 py-2.5 text-xs text-muted-foreground">
								<Sparkles class="size-4 shrink-0 text-primary" />
								<span class="truncate font-mono"><strong class="text-foreground">{{ t("landing.demo.prompt") }}:</strong> {{ currentDemo.prompt }}</span>
								<span class="ml-auto shrink-0 rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
									{{ currentDemo.model }}
								</span>
							</div>

							<!-- Code -->
							<div v-if="activeDemoTab === 'code'" class="flex flex-col gap-3">
								<div class="relative rounded-lg bg-background/80 p-4 font-mono text-xs leading-relaxed text-foreground/90 ring-1 ring-border/60">
									<button
										type="button"
										class="absolute right-3 top-3 flex cursor-pointer items-center gap-1 rounded bg-muted px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
										@click="copyCode(demoCode)"
									>
										<component :is="isCopied ? Check : Copy" class="size-3.5 text-primary" />
										{{ isCopied ? t("landing.demo.copied") : t("landing.demo.copy") }}
									</button>
									<pre class="overflow-x-auto text-left"><code>{{ demoCode }}</code></pre>
								</div>
								<div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
									<span class="flex items-center gap-1.5"><Check class="size-3.5 text-primary" /> {{ t("landing.demo.codeChecks.typed") }}</span>
									<span class="flex items-center gap-1.5"><Check class="size-3.5 text-primary" /> {{ t("landing.demo.codeChecks.copy") }}</span>
								</div>
							</div>

							<!-- Article -->
							<div v-else-if="activeDemoTab === 'writer'" class="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/60 p-4">
								<div class="flex items-center gap-2">
									<Badge variant="outline" class="border-primary/40 text-[10px] text-primary">{{ t("landing.demo.article.badge") }}</Badge>
									<span class="text-xs text-muted-foreground">{{ t("landing.demo.article.label") }}</span>
								</div>
								<h4 class="text-base font-bold text-foreground">{{ t("landing.demo.article.title") }}</h4>
								<p class="text-xs leading-relaxed text-muted-foreground">
									{{ t("landing.demo.article.excerpt") }}
								</p>
								<ul class="flex flex-col gap-2 border-t border-border/50 pt-3">
									<li v-for="section in articleSections" :key="section" class="flex items-center gap-2 text-xs text-muted-foreground">
										<Check class="size-3.5 shrink-0 text-primary" />
										{{ section }}
									</li>
								</ul>
							</div>

							<!-- Resume -->
							<div v-else-if="activeDemoTab === 'resume'" class="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/60 p-4">
								<div class="flex items-center justify-between gap-3">
									<div>
										<p class="text-xs text-muted-foreground">{{ t("landing.demo.resume.role") }}</p>
										<h4 class="text-sm font-bold text-foreground">{{ t("landing.demo.resume.verdict") }}</h4>
									</div>
									<div class="flex flex-col items-end">
										<span class="font-mono text-2xl font-bold text-primary">96%</span>
										<span class="text-[10px] text-muted-foreground">{{ t("landing.demo.resume.score") }}</span>
									</div>
								</div>
								<div class="flex flex-col gap-2 border-t border-border/50 pt-3">
									<div class="flex items-start gap-2 text-xs">
										<Check class="mt-0.5 size-4 shrink-0 text-primary" />
										<span class="text-muted-foreground">{{ t("landing.demo.resume.matchStack") }}</span>
									</div>
									<div class="flex items-start gap-2 text-xs">
										<Check class="mt-0.5 size-4 shrink-0 text-primary" />
										<span class="text-muted-foreground">{{ t("landing.demo.resume.matchApi") }}</span>
									</div>
									<div class="flex items-start gap-2 text-xs">
										<Sparkles class="mt-0.5 size-4 shrink-0 text-chart-3" />
										<span class="text-muted-foreground">{{ t("landing.demo.resume.gap") }}</span>
									</div>
								</div>
							</div>

							<!-- Image -->
							<div v-else-if="activeDemoTab === 'image'" class="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/60 p-4">
								<div class="flex items-center justify-between gap-3">
									<span class="text-xs font-semibold text-foreground">{{ t("landing.demo.image.title") }}</span>
									<Badge variant="outline" class="border-primary/30 text-[10px] text-primary">{{ t("landing.demo.image.badge") }}</Badge>
								</div>
								<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
									<div class="checkerboard grid h-24 place-items-center rounded-lg ring-1 ring-border/60">
										<ImageIcon class="size-7 text-muted-foreground/60" />
									</div>
									<ArrowRight class="size-4 text-muted-foreground" />
									<div class="grid h-24 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
										<Sparkles class="size-7 text-primary" />
									</div>
								</div>
								<div class="flex items-center justify-between text-[11px] text-muted-foreground">
									<span>{{ t("landing.demo.image.before") }}</span>
									<span>{{ t("landing.demo.image.after") }}</span>
								</div>
							</div>

							<div class="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3 text-xs">
								<span class="font-mono text-[11px] text-muted-foreground">{{ t("landing.demo.plan") }} <strong class="text-foreground">{{ t("landing.demo.requests") }}</strong></span>
								<NuxtLink :to="localePath('/dashboard')" class="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
									{{ t("landing.demo.open") }}
									<ArrowRight class="size-3.5" />
								</NuxtLink>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>

		<!-- TOOLS -->
		<section id="features" class="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-3">
				<p class="text-sm font-semibold text-primary">{{ t("landing.tools.eyebrow") }}</p>
				<h2 class="max-w-2xl text-balance text-3xl font-extrabold leading-tight sm:text-4xl">{{ t("landing.tools.title") }}</h2>
				<p class="max-w-2xl text-pretty leading-7 text-muted-foreground">
					{{ t("landing.tools.description") }}
				</p>
			</div>

			<div class="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<NuxtLink
					v-for="tool in tools"
					:key="tool.title"
					:to="localePath(tool.href)"
					class="group flex flex-col gap-4 rounded-xl bg-card/80 p-5 ring-1 ring-border/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
					:class="tool.span"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="grid size-10 place-items-center rounded-lg bg-primary/12 text-primary">
							<component :is="tool.icon" class="size-5" />
						</div>
						<Badge variant="outline" class="border-border/70 text-[11px] font-medium text-muted-foreground">
							{{ tool.category }}
						</Badge>
					</div>

					<div class="flex flex-col gap-1.5">
						<h3 class="text-lg font-bold">{{ tool.title }}</h3>
						<p class="text-sm leading-6 text-muted-foreground">{{ tool.description }}</p>
					</div>

					<div v-if="tool.preview === 'code'" class="rounded-lg bg-background/70 p-3 font-mono text-[11px] leading-6 text-muted-foreground ring-1 ring-border/60">
						<p><span class="text-primary">const</span> reply = <span class="text-chart-4">await</span> ask(prompt)</p>
						<p>messages.value.<span class="text-chart-2">push</span>(reply)</p>
						<p class="text-muted-foreground/70">{{ t("landing.tools.previewNote") }}</p>
					</div>

					<div v-else-if="tool.preview === 'image'" class="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
						<div class="checkerboard grid h-20 place-items-center rounded-lg ring-1 ring-border/60">
							<ImageIcon class="size-6 text-muted-foreground/60" />
						</div>
						<ArrowRight class="size-4 text-muted-foreground" />
						<div class="grid h-20 place-items-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
							<Sparkles class="size-6 text-primary" />
						</div>
					</div>

					<span class="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
						{{ t("landing.tools.open") }}
						<ArrowUpRight class="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
					</span>
				</NuxtLink>
			</div>
		</section>

		<!-- HOW IT WORKS -->
		<section class="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
			<div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
				<div class="flex flex-col gap-4">
					<p class="text-sm font-semibold text-primary">{{ t("landing.how.eyebrow") }}</p>
					<h2 class="text-balance text-3xl font-extrabold leading-tight sm:text-4xl">{{ t("landing.how.title") }}</h2>
					<p class="max-w-lg text-pretty leading-7 text-muted-foreground">
						{{ t("landing.how.description") }}
					</p>

					<ol class="mt-2 flex flex-col gap-5">
						<li v-for="step in steps" :key="step.number" class="flex gap-4">
							<span class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/12 font-mono text-sm font-bold text-primary">{{ step.number }}</span>
							<div class="flex flex-col gap-1">
								<h3 class="font-semibold">{{ step.title }}</h3>
								<p class="text-sm leading-6 text-muted-foreground">{{ step.description }}</p>
							</div>
						</li>
					</ol>
				</div>

				<Card class="overflow-hidden rounded-2xl border-border/70 bg-card/85 shadow-2xl shadow-primary/10 backdrop-blur">
					<CardContent class="flex flex-col gap-4 p-6">
						<div class="flex items-center justify-between gap-3">
							<div class="flex items-center gap-2">
								<Eraser class="size-4 text-primary" />
								<p class="text-sm font-semibold">{{ t("landing.how.sample.title") }}</p>
							</div>
							<Badge variant="outline" class="border-primary/30 bg-primary/10 text-[11px] text-primary">{{ t("landing.how.sample.badge") }}</Badge>
						</div>

						<div class="grid gap-3 sm:grid-cols-2">
							<figure class="flex flex-col gap-2">
								<div class="checkerboard grid h-40 place-items-center rounded-xl ring-1 ring-border/60">
									<div class="grid size-20 place-items-center rounded-full bg-muted-foreground/15">
										<ImageIcon class="size-8 text-muted-foreground/70" />
									</div>
								</div>
								<figcaption class="text-xs text-muted-foreground">{{ t("landing.how.sample.before") }}</figcaption>
							</figure>
							<figure class="flex flex-col gap-2">
								<div class="grid h-40 place-items-center rounded-xl bg-primary/10 ring-1 ring-primary/30">
									<div class="grid size-20 place-items-center rounded-full bg-primary/20">
										<Sparkles class="size-8 text-primary" />
									</div>
								</div>
								<figcaption class="text-xs text-muted-foreground">{{ t("landing.how.sample.after") }}</figcaption>
							</figure>
						</div>

						<div class="flex items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
							<Check class="size-3.5 shrink-0 text-primary" />
							<span>{{ t("landing.how.sample.note") }}</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>

		<!-- PRICING -->
		<section id="pricing" class="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-3">
				<p class="text-sm font-semibold text-primary">{{ t("landing.pricing.eyebrow") }}</p>
				<h2 class="max-w-2xl text-balance text-3xl font-extrabold leading-tight sm:text-4xl">{{ t("landing.pricing.title") }}</h2>
			</div>

			<div class="mt-10 grid max-w-4xl gap-4 md:grid-cols-2">
				<article
					v-for="plan in pricing"
					:key="plan.name"
					class="flex flex-col rounded-xl p-6 ring-1 transition duration-200 hover:-translate-y-1"
					:class="plan.featured ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/25 ring-primary' : 'bg-card/80 ring-border/70'"
				>
					<div class="flex items-center justify-between gap-3">
						<p class="font-semibold">{{ plan.name }}</p>
						<Badge v-if="plan.featured" variant="secondary" class="bg-primary-foreground/15 text-primary-foreground">{{ t("landing.pricing.popular") }}</Badge>
					</div>

					<div class="mt-4 flex items-baseline gap-2">
						<p class="font-mono text-4xl font-semibold">{{ plan.price }}</p>
						<p class="text-sm" :class="plan.featured ? 'text-primary-foreground/75' : 'text-muted-foreground'">{{ plan.period }}</p>
					</div>

					<p class="mt-3 min-h-12 text-sm leading-6" :class="plan.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'">
						{{ plan.description }}
					</p>

					<ul class="mt-6 flex flex-col gap-3">
						<li v-for="item in plan.items" :key="item" class="flex items-center gap-2 text-sm">
							<Zap class="size-4 shrink-0" :class="plan.featured ? 'text-primary-foreground' : 'text-primary'" />
							{{ item }}
						</li>
					</ul>

					<Button as-child :variant="plan.featured ? 'secondary' : 'outline'" class="mt-8">
						<NuxtLink :to="localePath('/auth/register')">{{ plan.cta }}</NuxtLink>
					</Button>
				</article>
			</div>
		</section>

		<!-- FAQ -->
		<section class="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
			<div class="flex flex-col gap-3">
				<p class="text-sm font-semibold text-primary">{{ t("landing.faq.eyebrow") }}</p>
				<h2 class="text-balance text-3xl font-extrabold leading-tight sm:text-4xl">{{ t("landing.faq.title") }}</h2>
			</div>

			<div class="mt-8 flex flex-col gap-3">
				<Collapsible
					v-for="item in faq"
					:key="item.question"
					v-slot="{ open }"
					class="rounded-xl bg-card/70 ring-1 ring-border/70"
				>
					<CollapsibleTrigger class="flex w-full items-center justify-between gap-4 rounded-xl p-5 text-left text-sm font-semibold transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:text-base">
						<span>{{ item.question }}</span>
						<ChevronDown class="size-4 shrink-0 text-muted-foreground transition-transform duration-200" :class="open ? 'rotate-180' : ''" />
					</CollapsibleTrigger>
					<CollapsibleContent class="px-5 pb-5 text-sm leading-6 text-muted-foreground">
						{{ item.answer }}
					</CollapsibleContent>
				</Collapsible>
			</div>
		</section>

		<!-- FINAL CTA -->
		<section class="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
			<div class="relative overflow-hidden rounded-2xl bg-card/80 px-6 py-12 ring-1 ring-border/70 sm:px-12">
				<div class="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-primary/20 blur-3xl" />
				<div class="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
					<div class="flex max-w-xl flex-col gap-3">
						<h2 class="text-balance text-3xl font-extrabold leading-tight">{{ t("landing.finalCta.title") }}</h2>
						<p class="text-muted-foreground">{{ t("landing.finalCta.description") }}</p>
					</div>
					<Button as-child size="lg" class="h-12 shrink-0 px-6 shadow-xl shadow-primary/25 active:scale-[0.98]">
						<NuxtLink :to="localePath('/auth/register')">
							{{ t("landing.finalCta.button") }}
							<ArrowRight class="size-4" />
						</NuxtLink>
					</Button>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.checkerboard {
	background-color: var(--muted);
	background-image:
		linear-gradient(45deg, var(--background) 25%, transparent 25%),
		linear-gradient(-45deg, var(--background) 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, var(--background) 75%),
		linear-gradient(-45deg, transparent 75%, var(--background) 75%);
	background-size: 12px 12px;
	background-position: 0 0, 0 6px, 6px -6px, -6px 0;
}
</style>
