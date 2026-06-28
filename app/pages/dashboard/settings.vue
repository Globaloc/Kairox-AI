<script setup lang="ts">
import {
	ArrowLeft,
	CalendarClock,
	Check,
	CircleAlert,
	CreditCard,
	ExternalLink,
	Gauge,
	ReceiptText,
	RefreshCw,
	Sparkles,
	Zap,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

definePageMeta({
	layout: "dashboard",
	middleware: "auth"
});

useHead({
	title: "Billing settings - Kairox AI",
	meta: [
		{
			name: "description",
			content: "View and manage your Kairox AI plan, renewal, and billing details.",
		},
	],
});

const { t, tm, locale } = useI18n();
const localePath = useLocalePath();

const { data: userData, status, error, refresh } = await useFetch("/api/user", {
	key: "userData",
});
const { upgradeUserToPro } = useAuth();

const isStartingCheckout = ref(false);
const isPro = computed(() => Boolean(userData.value?.subscription));
const subscription = computed(() => userData.value?.subscription);

const formatDate = (date?: string | Date | null) => {
	if (!date) return t("settings.notAvailable");

	return new Intl.DateTimeFormat(locale.value, {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date(date));
};

const formatPrice = (amount?: number, currency?: string) => {
	if (amount === undefined || !currency) return "—";

	return new Intl.NumberFormat(locale.value, {
		style: "currency",
		currency: currency.toUpperCase(),
	}).format(amount / 100);
};

const billingInterval = computed(() => {
	const interval = subscription.value?.recurringInterval;
	return interval ? t("settings.perInterval", { interval }) : t("settings.perMonth");
});

const renewalLabel = computed(() => {
	if (subscription.value?.cancelAtPeriodEnd) return t("settings.accessEnds");
	return t("settings.nextBilling");
});

const proStatusDescription = computed(() => {
	if (subscription.value?.cancelAtPeriodEnd) {
		return t("settings.proCanceled");
	}

	return t("settings.proActive");
});

const startCheckout = async () => {
	isStartingCheckout.value = true;

	try {
		await upgradeUserToPro();
	} catch {
		toast.error(t("settings.checkoutError"));
		isStartingCheckout.value = false;
	}
};

const proBenefits = computed(() => tm("settings.benefits") as string[]);
</script>

<template>
	<main id="main-content" class="min-h-[calc(100svh-var(--header-height))] bg-background">
		<div class="mx-auto flex w-full max-w-6xl flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
			<NuxtLink :to="localePath('/dashboard')"
				class="group mb-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
				<ArrowLeft class="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
				{{ t("common.backToWorkspace") }}
			</NuxtLink>

			<header class="max-w-2xl">
				<p class="text-sm font-medium text-primary">{{ t("settings.eyebrow") }}</p>
				<h1 class="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
					{{ t("settings.title") }}
				</h1>
				<p class="mt-3 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
					{{ t("settings.description") }}
				</p>
			</header>

			<section v-if="status === 'pending'" :aria-label="t('settings.loadingBilling')"
				class="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
				<Skeleton class="h-80 rounded-2xl" />
				<Skeleton class="h-64 rounded-2xl" />
			</section>

			<section v-else-if="error" class="mt-8 max-w-2xl rounded-2xl bg-card p-6 ring-1 ring-destructive/25 sm:p-8">
				<div class="flex items-start gap-4">
					<div class="grid size-10 shrink-0 place-items-center rounded-lg bg-destructive/10 text-destructive">
						<CircleAlert class="size-5" />
					</div>
					<div>
						<h2 class="text-lg font-semibold tracking-tight">{{ t("settings.unavailable") }}</h2>
						<p class="mt-1 text-sm leading-6 text-muted-foreground">
							{{ t("settings.unavailableDescription") }}
						</p>
						<Button variant="outline" class="mt-5 active:scale-[0.98]" @click="refresh()">
							<RefreshCw class="size-4" />
							{{ t("settings.tryAgain") }}
						</Button>
					</div>
				</div>
			</section>

			<section v-else-if="!isPro" aria-labelledby="current-plan-heading"
				class="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:items-start">
				<article
					class="relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70 sm:p-8">
					<div
						class="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
					<div class="relative">
						<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
							<div>
								<div class="flex items-center gap-3">
									<div
										class="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
										<Gauge class="size-5" />
									</div>
									<div>
										<p class="text-sm font-medium text-muted-foreground">{{ t("settings.currentPlan") }}</p>
										<h2 id="current-plan-heading" class="text-2xl font-semibold tracking-tight">{{ t("settings.free") }}</h2>
									</div>
								</div>
							</div>
							<span
								class="w-fit rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">No
								{{ t("settings.noRenewal") }}</span>
						</div>

						<p class="mt-8 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
							{{ t("settings.freeDescription") }}
						</p>

						<div class="mt-8 grid gap-px overflow-hidden rounded-xl bg-border/70 sm:grid-cols-2">
							<div class="bg-background/85 p-4 sm:p-5">
								<p class="text-sm text-muted-foreground">{{ t("settings.dailyUsage") }}</p>
								<p class="mt-1 text-xl font-semibold tabular-nums">{{ userData?.userApiLimitCount ?? 0 }} of 5
								</p>
							</div>
							<div class="bg-background/85 p-4 sm:p-5">
								<p class="text-sm text-muted-foreground">{{ t("settings.billingDetails") }}</p>
								<p class="mt-1 text-xl font-semibold">{{ t("settings.notRequired") }}</p>
							</div>
						</div>

						<Button class="mt-8 h-11 shadow-lg shadow-primary/20 active:scale-[0.98]"
							:disabled="isStartingCheckout" @click="startCheckout">
							<RefreshCw v-if="isStartingCheckout" class="size-4 animate-spin" />
							<Zap v-else class="size-4" />
							{{ isStartingCheckout ? t("settings.openingCheckout") : t("settings.upgrade") }}
						</Button>
					</div>
				</article>

				<aside class="rounded-2xl bg-secondary/75 p-6 ring-1 ring-border/60 sm:p-7">
					<div class="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
						<Sparkles class="size-5" />
					</div>
					<p class="mt-5 text-sm font-medium text-primary">{{ t("settings.proTitle") }}</p>
					<h2 class="mt-1 text-2xl font-semibold tracking-tight">{{ t("settings.proSubtitle") }}</h2>
					<ul class="mt-6 space-y-4">
						<li v-for="benefit in proBenefits" :key="benefit" class="flex gap-3 text-sm leading-6">
							<Check class="mt-0.5 size-4 shrink-0 text-primary" />
							<span class="text-muted-foreground">{{ benefit }}</span>
						</li>
					</ul>
				</aside>
			</section>

			<section v-else aria-labelledby="current-plan-heading" class="mt-8 space-y-5">
				<article
					class="relative overflow-hidden rounded-2xl bg-card p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70 sm:p-8">
					<div
						class="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_58%)]" />
					<div class="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
						<div class="max-w-xl">
							<div class="flex items-center gap-3">
								<div class="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
									<Sparkles class="size-5" />
								</div>
								<div>
										<p class="text-sm font-medium text-muted-foreground">{{ t("settings.currentPlan") }}</p>
									<div class="flex flex-wrap items-center gap-2">
										<h2 id="current-plan-heading" class="text-2xl font-semibold tracking-tight">Kairox Pro
										</h2>
										<span class="rounded-md bg-primary/12 px-2 py-0.5 text-xs font-semibold text-primary">
											{{ subscription?.cancelAtPeriodEnd ? t("settings.ending") : t("settings.active") }}
										</span>
									</div>
								</div>
							</div>
							<p class="mt-7 text-pretty text-base leading-7 text-muted-foreground">
								{{ proStatusDescription }}
							</p>
						</div>

						<Button v-if="userData?.customerPortalUrl" as-child
							class="h-11 shadow-lg shadow-primary/20 active:scale-[0.98]">
							<a :href="userData.customerPortalUrl" target="_blank" rel="noopener noreferrer">
								<CreditCard class="size-4" />
								{{ t("settings.manage") }}
								<ExternalLink class="size-3.5 opacity-70" />
							</a>
						</Button>
					</div>
				</article>

				<div class="grid gap-5 md:grid-cols-2">
					<article class="rounded-2xl bg-card p-6 ring-1 ring-border/70 sm:p-7">
						<div class="flex items-center gap-3">
							<div class="grid size-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
								<CalendarClock class="size-5" />
							</div>
							<h3 class="text-lg font-semibold tracking-tight">{{ t("settings.billingCycle") }}</h3>
						</div>
						<dl class="mt-6 space-y-4 text-sm">
							<div class="flex items-center justify-between gap-4 border-b border-border/70 pb-4">
								<dt class="text-muted-foreground">{{ t("settings.planPrice") }}</dt>
								<dd class="font-semibold tabular-nums">{{ formatPrice(subscription?.amount,
									subscription?.currency) }} <span class="font-normal text-muted-foreground">{{ billingInterval
										}}</span></dd>
							</div>
							<div class="flex items-center justify-between gap-4">
								<dt class="text-muted-foreground">{{ renewalLabel }}</dt>
								<dd class="font-semibold tabular-nums">{{ formatDate(subscription?.currentPeriodEnd) }}</dd>
							</div>
						</dl>
					</article>

					<article class="rounded-2xl bg-secondary/75 p-6 ring-1 ring-border/60 sm:p-7">
						<div class="flex items-center gap-3">
							<div class="grid size-10 place-items-center rounded-lg bg-primary/15 text-primary">
								<ReceiptText class="size-5" />
							</div>
							<h3 class="text-lg font-semibold tracking-tight">{{ t("settings.receipts") }}</h3>
						</div>
						<p class="mt-6 max-w-md text-sm leading-6 text-muted-foreground">
							{{ t("settings.receiptsDescription") }}
						</p>
						<a v-if="userData?.customerPortalUrl" :href="userData.customerPortalUrl" target="_blank"
							rel="noopener noreferrer"
							class="mt-5 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
							{{ t("settings.openPortal") }}
							<ExternalLink class="size-3.5" />
						</a>
					</article>
				</div>
			</section>
		</div>
	</main>
</template>
