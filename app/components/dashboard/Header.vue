<script setup>
	import { SidebarTrigger } from "@/components/ui/sidebar"
	import { Plus, Search } from "lucide-vue-next"
	import { Button } from "@/components/ui/button"
	import { Input } from "@/components/ui/input"
	import ModeToggle from "@/components/ColorModeButton"

	const { t } = useI18n()
</script>

<template>
	<div class="sticky top-0 z-50 w-full flex flex-col px-4 py-2 gap-2 bg-card/80 shadow-sm shadow-primary/5 ring-1 ring-border/70 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
					<div class="flex items-center justify-between gap-3 w-57">
							<Logo/>
						<SidebarTrigger class="hidden lg:inline-flex" />
						</div>
					<div class="flex flex-col gap-4 sm:flex-row">
						<div class="relative flex h-10 items-center gap-2 rounded-md border border-input bg-background  text-muted-foreground">
							<Search class="absolute -translate-y-1/2 top-1/2 left-3 size-4" />
							<Input class="h-10 !bg-background min-w-68 pl-9 pr-3" :placeholder="t('dashboardHeader.search')" />
						</div>
						<Button class="h-10 shadow-lg shadow-primary/20 active:scale-[0.98]">
							<Plus class="size-4" />
							{{ t("dashboardHeader.newRun") }}
						</Button>
						<ModeToggle />
					</div>
				</div>
</template>

<style lang='scss'scoped>
	
</style>
