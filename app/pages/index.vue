<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Bot, Braces, Check, Clock3, Database, Gauge, Play, Sparkles, Zap } from "lucide-vue-next";

const activeSlide = ref(0);

useHead({
	title: "Kairox AI - AI SaaS workspace",
	meta: [
		{
			name: "description",
			content: "Kairox AI helps teams prototype prompts, track usage, and ship AI workflows from one focused dashboard.",
		},
	],
});

const stats = [
	{ label: "Avg. response time", value: "1.28s" },
	{ label: "Runs this month", value: "18,742" },
	{ label: "Saved prompts", value: "326" },
];

const features = [
	{
		title: "Prompt workspace",
		description: "Draft, compare, and store production prompts without losing context between experiments.",
		icon: Braces,
	},
	{
		title: "Usage visibility",
		description: "Track spend, latency, and model output quality before a workflow becomes expensive.",
		icon: Gauge,
	},
	{
		title: "Data-ready flows",
		description: "Connect app data, keep audit trails, and hand off repeatable runs to your team.",
		icon: Database,
	},
];

const pricing = [
	{ name: "Starter", price: "$19", description: "For solo builders validating one AI product.", items: ["3 workspaces", "50k tokens included", "Prompt history"] },
	{ name: "Studio", price: "$49", description: "For small teams shipping workflows weekly.", items: ["12 workspaces", "Usage alerts", "Shared prompt library"], featured: true },
	{ name: "Scale", price: "$119", description: "For products with active customers and stricter reviews.", items: ["Unlimited projects", "Team roles", "Priority support"] },
];

const slides = [
	{
		kicker: "Prompt review",
		title: "Compare three prompt variants before you ship one.",
		description: "Run side-by-side outputs, score the useful response, and keep the winner attached to the project timeline.",
		metric: "3.6x",
		metricLabel: "faster review loop",
		accent: "bg-primary",
	},
	{
		kicker: "Usage guardrails",
		title: "Catch spend spikes while the product is still quiet.",
		description: "Budget alerts and latency checks sit beside every workflow, so surprises show up before customers feel them.",
		metric: "$74",
		metricLabel: "saved this week",
		accent: "bg-chart-2",
	},
	{
		kicker: "Team handoff",
		title: "Give product, support, and engineering the same board.",
		description: "Prompt notes, model runs, and customer context live together instead of scattered across five tabs.",
		metric: "12",
		metricLabel: "shared projects",
		accent: "bg-chart-4",
	},
];

const activeCarouselSlide = computed(() => slides[activeSlide.value] ?? slides[0]!);

let slideTimer: ReturnType<typeof setInterval> | undefined;

function goToSlide(index: number) {
	activeSlide.value = (index + slides.length) % slides.length;
}

onMounted(() => {
	slideTimer = setInterval(() => goToSlide(activeSlide.value + 1), 4500);
});

onBeforeUnmount(() => {
	if (slideTimer) clearInterval(slideTimer);
});
</script>

<template>
	<div class="w-full">
		<section class="relative mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
			<div class="max-w-3xl">
				<div class="mb-6 inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
					<Sparkles class="size-4" />
					AI workflows for teams that ship
				</div>

				<h1 class="max-w-4xl text-balance text-5xl font-extrabold leading-[0.95] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
					Build your AI product from one focused dashboard.
				</h1>

				<p class="mt-6 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
					Kairox AI gives you a calm workspace for prompts, usage, customers, and model runs. Less ceremony, more useful product work.
				</p>

				<div class="mt-8 flex flex-col gap-3 sm:flex-row">
					<Button as-child size="lg" class="h-12 px-6 shadow-xl shadow-primary/20 active:scale-[0.98]">
						<NuxtLink to="/dashboard">
							Open dashboard
							<ArrowRight class="size-4" />
						</NuxtLink>
					</Button>
					<Button as-child variant="outline" size="lg" class="h-12 px-6 active:scale-[0.98]">
						<a href="#features">
							<Play class="size-4" />
							See features
						</a>
					</Button>
				</div>

				<div class="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
					<div v-for="item in stats" :key="item.label" class="rounded-lg bg-card/70 p-4 shadow-sm shadow-primary/5 ring-1 ring-border/70 backdrop-blur">
						<p class="font-mono text-2xl font-semibold text-foreground">{{ item.value }}</p>
						<p class="mt-1 text-sm text-muted-foreground">{{ item.label }}</p>
					</div>
				</div>
			</div>

			<div class="relative">
				<div class="absolute -left-6 top-8 hidden h-24 w-24 rounded-xl bg-primary/10 blur-2xl lg:block" />
				<Card class="relative overflow-hidden rounded-xl border-border/60 bg-card/85 shadow-2xl shadow-primary/10 backdrop-blur">
					<CardContent class="p-0">
						<div class="border-b border-border/70 p-5">
							<div class="flex items-center justify-between">
								<div>
									<p class="text-sm font-semibold text-muted-foreground">Live workspace</p>
									<h2 class="mt-1 text-xl font-bold">Kairox launch board</h2>
								</div>
								<div class="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">Active</div>
							</div>
						</div>
						<div class="grid gap-4 p-5">
							<div class="rounded-lg bg-secondary/80 p-4">
								<div class="flex items-start gap-3">
									<div class="grid size-10 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
										<Bot class="size-5" />
									</div>
									<div>
										<p class="font-semibold">Product assistant</p>
										<p class="mt-1 text-sm leading-6 text-muted-foreground">Summarized 47 feedback notes and found 6 repeated requests around onboarding.</p>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div class="rounded-lg bg-muted/70 p-4">
									<p class="text-sm text-muted-foreground">Cost today</p>
									<p class="mt-2 font-mono text-3xl font-semibold">$8.42</p>
								</div>
								<div class="rounded-lg bg-muted/70 p-4">
									<p class="text-sm text-muted-foreground">Quality score</p>
									<p class="mt-2 font-mono text-3xl font-semibold">94.6</p>
								</div>
							</div>
							<div class="space-y-3">
								<div v-for="task in ['Create billing prompt', 'Review auth callback', 'Publish dashboard copy']" :key="task" class="flex items-center gap-3 rounded-md border border-border/70 bg-background/70 px-3 py-3">
									<Check class="size-4 text-primary" />
									<span class="text-sm font-medium">{{ task }}</span>
									<Clock3 class="ml-auto size-4 text-muted-foreground" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>

		<section id="features" class="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
			<div class="max-w-2xl">
				<p class="text-sm font-semibold text-primary">What ships inside</p>
				<h2 class="mt-3 text-balance text-4xl font-extrabold leading-tight">The core pieces you need after auth works.</h2>
			</div>
			<div class="mt-10 grid gap-4 md:grid-cols-3">
				<article v-for="feature in features" :key="feature.title" class="rounded-xl bg-card/80 p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
					<div class="grid size-11 place-items-center rounded-lg bg-primary/12 text-primary">
						<component :is="feature.icon" class="size-5" />
					</div>
					<h3 class="mt-5 text-xl font-bold">{{ feature.title }}</h3>
					<p class="mt-3 max-w-[34ch] leading-7 text-muted-foreground">{{ feature.description }}</p>
				</article>
			</div>
		</section>

		<section class="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
			<div class="grid gap-8 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
				<div>
					<p class="text-sm font-semibold text-primary">How teams use it</p>
					<h2 class="mt-3 text-balance text-4xl font-extrabold leading-tight">A smoother loop from rough prompt to shipped workflow.</h2>
					<p class="mt-4 max-w-[58ch] text-pretty leading-7 text-muted-foreground">
						The dashboard is built around the work you repeat every week: test, measure, hand off, and improve.
					</p>

					<div class="mt-6 flex items-center gap-2">
						<Button variant="outline" size="icon" aria-label="Previous slide" class="active:scale-[0.96]" @click="goToSlide(activeSlide - 1)">
							<ArrowLeft class="size-4" />
						</Button>
						<Button variant="outline" size="icon" aria-label="Next slide" class="active:scale-[0.96]" @click="goToSlide(activeSlide + 1)">
							<ArrowRight class="size-4" />
						</Button>
						<div class="ml-3 flex items-center gap-2">
							<button
								v-for="(_, index) in slides"
								:key="index"
								type="button"
								:aria-label="`Show slide ${index + 1}`"
								class="h-2 rounded-full transition-all duration-300"
								:class="activeSlide === index ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'"
								@click="goToSlide(index)"
							/>
						</div>
					</div>
				</div>

				<Card class="overflow-hidden rounded-xl border-border/70 bg-card/85 shadow-2xl shadow-primary/10 backdrop-blur">
					<CardContent class="p-0">
						<Transition name="slide-fade" mode="out-in">
							<article :key="activeSlide" class="grid min-h-[28rem] gap-0 md:grid-cols-[1fr_0.72fr]">
								<div class="flex flex-col justify-between p-6 sm:p-8">
									<div>
										<div class="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground">
												<span class="size-2 rounded-full" :class="activeCarouselSlide.accent" />
												{{ activeCarouselSlide.kicker }}
											</div>
											<h3 class="mt-6 max-w-xl text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
												{{ activeCarouselSlide.title }}
											</h3>
											<p class="mt-4 max-w-[56ch] text-pretty leading-7 text-muted-foreground">
												{{ activeCarouselSlide.description }}
											</p>
										</div>

										<div class="mt-10 grid gap-3 sm:grid-cols-3">
											<div class="rounded-lg bg-muted/70 p-4">
												<p class="font-mono text-3xl font-semibold">{{ activeCarouselSlide.metric }}</p>
												<p class="mt-1 text-sm text-muted-foreground">{{ activeCarouselSlide.metricLabel }}</p>
											</div>
										<div class="rounded-lg bg-muted/70 p-4">
											<p class="font-mono text-3xl font-semibold">94.6</p>
											<p class="mt-1 text-sm text-muted-foreground">quality score</p>
										</div>
										<div class="rounded-lg bg-muted/70 p-4">
											<p class="font-mono text-3xl font-semibold">1.28s</p>
											<p class="mt-1 text-sm text-muted-foreground">median latency</p>
										</div>
									</div>
								</div>

								<div class="relative overflow-hidden bg-secondary/70 p-6">
									<div class="absolute -right-8 top-8 size-32 rounded-full bg-primary/20 blur-3xl" />
									<div class="relative grid h-full content-center gap-4">
										<div class="rounded-xl bg-background/80 p-4 shadow-lg shadow-primary/10 ring-1 ring-border/70">
											<div class="flex items-center gap-3">
												<div class="grid size-10 place-items-center rounded-md bg-primary/15 text-primary">
													<Bot class="size-5" />
												</div>
												<div>
													<p class="font-semibold">Workflow run</p>
													<p class="text-sm text-muted-foreground">Latest output scored</p>
												</div>
											</div>
											<div class="mt-5 space-y-2">
												<div class="h-2 rounded-full bg-primary/80" />
												<div class="h-2 w-4/5 rounded-full bg-primary/40" />
												<div class="h-2 w-3/5 rounded-full bg-primary/25" />
											</div>
										</div>
										<div class="ml-8 rounded-xl bg-background/80 p-4 shadow-lg shadow-primary/10 ring-1 ring-border/70">
											<p class="text-sm font-semibold">Recommended action</p>
											<p class="mt-2 text-sm leading-6 text-muted-foreground">Keep the support context window and lower the reply temperature.</p>
										</div>
									</div>
								</div>
							</article>
						</Transition>
					</CardContent>
				</Card>
			</div>
		</section>

		<section id="pricing" class="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
			<div class="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
				<div>
					<p class="text-sm font-semibold text-primary">Pricing</p>
					<h2 class="mt-3 text-balance text-4xl font-extrabold leading-tight">Start small, keep the dashboard when the product grows.</h2>
				</div>
				<div class="grid gap-4 md:grid-cols-3">
					<article v-for="plan in pricing" :key="plan.name" class="flex min-h-[23rem] flex-col rounded-xl p-5 ring-1 transition duration-200 hover:-translate-y-1" :class="plan.featured ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/25 ring-primary' : 'bg-card/80 ring-border/70'">
						<p class="font-semibold">{{ plan.name }}</p>
						<p class="mt-4 font-mono text-4xl font-semibold">{{ plan.price }}</p>
						<p class="mt-3 min-h-16 text-sm leading-6" :class="plan.featured ? 'text-primary-foreground/80' : 'text-muted-foreground'">{{ plan.description }}</p>
						<ul class="mt-6 space-y-3">
							<li v-for="item in plan.items" :key="item" class="flex items-center gap-2 text-sm">
								<Zap class="size-4" />
								{{ item }}
							</li>
						</ul>
						<Button as-child :variant="plan.featured ? 'secondary' : 'outline'" class="mt-auto">
							<NuxtLink to="/auth/register">Get started</NuxtLink>
						</Button>
					</article>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: opacity 240ms ease, transform 240ms ease;
}

.slide-fade-enter-from {
	opacity: 0;
	transform: translateX(1rem);
}

.slide-fade-leave-to {
	opacity: 0;
	transform: translateX(-1rem);
}
</style>
