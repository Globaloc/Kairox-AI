<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import {
	Activity,
	ArrowUpRight,
	Bot,
	ChevronRight,
	Clock3,
	CreditCard,
	FileText,
	FolderKanban,
	LayoutGrid,
	MessageSquareText,
	Plus,
	Search,
	Settings,
	Sparkles,
	Users,
	Zap,
} from "lucide-vue-next";

definePageMeta({
	layout: 'dashboard'
})

const localePath = useLocalePath()
await navigateTo(localePath('/dashboard'), { replace: true })

useHead({
	title: "Dashboard - Kairox AI",
	meta: [
		{
			name: "description",
			content: "Kairox AI dashboard for prompt workflows, usage, projects, and team activity.",
		},
	],
});

const navItems = [
	{ label: "Overview", icon: LayoutGrid, active: true },
	{ label: "Projects", icon: FolderKanban },
	{ label: "Prompts", icon: FileText },
	{ label: "Usage", icon: Activity },
	{ label: "Billing", icon: CreditCard },
	{ label: "Settings", icon: Settings },
];

const metrics = [
	{ label: "Model runs", value: "18,742", change: "+12.4%", icon: Zap },
	{ label: "Active users", value: "1,284", change: "+8.7%", icon: Users },
	{ label: "Avg. latency", value: "1.28s", change: "-0.31s", icon: Clock3 },
	{ label: "Spend", value: "$842.19", change: "+$74", icon: CreditCard },
];

const projects = [
	{ name: "Onboarding assistant", status: "Production", usage: "7,420", score: "96.2", tone: "bg-primary", progress: "92%" },
	{ name: "Support triage", status: "Review", usage: "4,106", score: "91.8", tone: "bg-chart-2", progress: "74%" },
	{ name: "Content brief maker", status: "Draft", usage: "2,318", score: "88.4", tone: "bg-chart-4", progress: "61%" },
];

const activity = [
	{ title: "Billing prompt moved to production", meta: "Damil pushed v1.4 · 18 min ago" },
	{ title: "Support triage flagged 12 low-confidence replies", meta: "Quality monitor · 41 min ago" },
	{ title: "New teammate joined the Studio workspace", meta: "GitHub OAuth · 2 hr ago" },
	{ title: "Usage alert set for GPT-5 Nano runs", meta: "Automation rule · 4 hr ago" },
];

const pipeline = [
	{ label: "Input", value: "2.4k", height: "h-20" },
	{ label: "Review", value: "846", height: "h-28" },
	{ label: "Ship", value: "391", height: "h-16" },
	{ label: "Learn", value: "128", height: "h-24" },
];
</script>

<template>
	<SidebarProvider>
		<Sidebar>
			<SidebarHeader>
				<div class="grid size-10 shrink-0 place-items-center rounded-lg bg-primary text-sm font-extrabold text-primary-foreground shadow-lg shadow-primary/20">
					K
				</div>
				<div class="min-w-0">
					<p class="truncate text-sm font-bold">Kairox Studio</p>
					<p class="truncate text-xs text-muted-foreground">AI SaaS workspace</p>
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Workspace</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in navItems" :key="item.label">
							<SidebarMenuButton :active="item.active">
								<template #icon>
									<component :is="item.icon" class="size-4" />
								</template>
								{{ item.label }}
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel>Fast actions</SidebarGroupLabel>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<template #icon>
									<Plus class="size-4" />
								</template>
								New model run
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton>
								<template #icon>
									<MessageSquareText class="size-4" />
								</template>
								Ask assistant
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<div class="rounded-xl bg-secondary/85 p-4 ring-1 ring-border/70">
					<div class="flex items-center gap-3">
						<div class="grid size-10 place-items-center rounded-md bg-primary/15 text-primary">
							<Sparkles class="size-5" />
						</div>
						<div class="min-w-0">
							<p class="truncate text-sm font-semibold">Studio plan</p>
							<p class="truncate text-xs text-muted-foreground">68% budget used</p>
						</div>
					</div>
					<div class="mt-4 h-2 overflow-hidden rounded-full bg-background">
						<div class="h-full w-[68%] rounded-full bg-primary" />
					</div>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>

		<SidebarInset>
				<DashboardHeader />
			<div class="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
				<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
					<Card v-for="metric in metrics" :key="metric.label" class="rounded-xl bg-card/80 shadow-sm shadow-primary/5 ring-1 ring-border/70 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
						<CardContent class="p-5">
							<div class="flex items-center justify-between">
								<div class="grid size-10 place-items-center rounded-md bg-primary/12 text-primary">
									<component :is="metric.icon" class="size-5" />
								</div>
								<span class="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{{ metric.change }}</span>
							</div>
							<p class="mt-5 text-sm font-medium text-muted-foreground">{{ metric.label }}</p>
							<p class="mt-1 font-mono text-3xl font-semibold tracking-normal">{{ metric.value }}</p>
						</CardContent>
					</Card>
				</div>

				<div class="grid gap-6 xl:grid-cols-[1fr_22rem]">
					<Card class="overflow-hidden rounded-xl bg-card/80 shadow-sm shadow-primary/5 ring-1 ring-border/70">
						<CardHeader class="flex flex-row items-center justify-between space-y-0">
							<CardTitle>Workflow pipeline</CardTitle>
							<Button variant="ghost" size="sm">
								View report
								<ArrowUpRight class="size-4" />
							</Button>
						</CardHeader>
						<CardContent>
							<div class="grid min-h-72 gap-5 rounded-lg bg-muted/40 p-5 md:grid-cols-[1fr_14rem]">
								<div class="flex items-end gap-4">
									<div v-for="item in pipeline" :key="item.label" class="flex flex-1 flex-col items-center gap-3">
										<div class="flex w-full items-end justify-center rounded-lg bg-background/70 p-2">
											<div class="w-full rounded-md bg-primary/80 shadow-lg shadow-primary/20" :class="item.height" />
										</div>
										<div class="text-center">
											<p class="font-mono text-lg font-semibold">{{ item.value }}</p>
											<p class="text-xs text-muted-foreground">{{ item.label }}</p>
										</div>
									</div>
								</div>
								<div class="rounded-lg bg-card/80 p-4 ring-1 ring-border/70">
									<p class="text-sm font-semibold">Most useful signal</p>
									<p class="mt-3 text-3xl font-extrabold">47.2%</p>
									<p class="mt-3 text-sm leading-6 text-muted-foreground">Support prompts with retrieval context convert better this week.</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card class="rounded-xl bg-card/80 shadow-sm shadow-primary/5 ring-1 ring-border/70">
						<CardHeader>
							<CardTitle>Assistant queue</CardTitle>
						</CardHeader>
						<CardContent class="space-y-4">
							<div class="rounded-lg bg-primary p-5 text-primary-foreground shadow-xl shadow-primary/25">
								<div class="flex items-center gap-3">
									<div class="grid size-10 place-items-center rounded-md bg-white/15">
										<Bot class="size-5" />
									</div>
									<div>
										<p class="font-semibold">Customer insight run</p>
										<p class="text-sm text-primary-foreground/75">Ready in 3 minutes</p>
									</div>
								</div>
								<div class="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
									<div class="h-full w-[74%] rounded-full bg-white" />
								</div>
							</div>

							<div class="grid grid-cols-2 gap-3">
								<div class="rounded-lg bg-muted/70 p-4">
									<MessageSquareText class="size-5 text-primary" />
									<p class="mt-3 font-mono text-2xl font-semibold">412</p>
									<p class="text-sm text-muted-foreground">Replies</p>
								</div>
								<div class="rounded-lg bg-muted/70 p-4">
									<Activity class="size-5 text-primary" />
									<p class="mt-3 font-mono text-2xl font-semibold">27</p>
									<p class="text-sm text-muted-foreground">Checks</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div class="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
					<Card class="rounded-xl bg-card/80 shadow-sm shadow-primary/5 ring-1 ring-border/70">
						<CardHeader class="flex flex-row items-center justify-between space-y-0">
							<CardTitle>Project health</CardTitle>
							<Button variant="ghost" size="sm">
								View all
								<ArrowUpRight class="size-4" />
							</Button>
						</CardHeader>
						<CardContent class="space-y-3">
							<article v-for="project in projects" :key="project.name" class="grid gap-4 rounded-lg border border-border/70 bg-background/70 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
								<div class="flex min-w-0 items-center gap-3">
									<span class="size-3 shrink-0 rounded-full" :class="project.tone" />
									<div class="min-w-0">
										<h2 class="truncate font-semibold">{{ project.name }}</h2>
										<p class="mt-1 text-sm text-muted-foreground">{{ project.status }} · {{ project.usage }} runs this month</p>
										<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
											<div class="h-full rounded-full bg-primary" :style="{ width: project.progress }" />
										</div>
									</div>
								</div>
								<div class="flex items-center gap-3 sm:justify-end">
									<span class="font-mono text-2xl font-semibold">{{ project.score }}</span>
									<span class="text-sm text-muted-foreground">quality</span>
								</div>
							</article>
						</CardContent>
					</Card>

					<Card class="rounded-xl bg-card/80 shadow-sm shadow-primary/5 ring-1 ring-border/70">
						<CardHeader>
							<CardTitle>Recent activity</CardTitle>
						</CardHeader>
						<CardContent class="space-y-3">
							<article v-for="item in activity" :key="item.title" class="rounded-lg border border-border/70 bg-background/70 p-4">
								<p class="font-semibold">{{ item.title }}</p>
								<p class="mt-2 text-sm text-muted-foreground">{{ item.meta }}</p>
							</article>
						</CardContent>
					</Card>
				</div>
			</div>
		</SidebarInset>
	</SidebarProvider>
</template>
