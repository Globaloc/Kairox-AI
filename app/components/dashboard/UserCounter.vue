<script setup lang="ts">
import {
	Sparkles, 
	Zap
} from "lucide-vue-next"

import { Progress } from '@/components/ui/progress'
import { MAX_COUNT } from '~~/shared/utils/user-api-limit'

const { data: userData, status } = await useFetch("/api/user", { 
	key: "userData"
})

const { upgradeUserToPro } = useAuth()
const { t } = useI18n()

const progress = computed(() => {
	if(userData.value) {
		return (userData.value.userApiLimitCount / MAX_COUNT) * 100
	}
})

const isPro = computed(() => !!userData.value?.subscription)
</script>

<template>
	<div v-if="status != 'pending' && !isPro" class="rounded-xl bg-secondary/85 p-4 ring-1 ring-border/70 transition-opacity duration-200 group-data-[collapsible=icon]:hidden">
				<div class="flex items-center gap-3">
					<div class="grid size-8 place-items-center rounded-md bg-primary/15 text-primary">
						<Sparkles class="size-4" />
					</div>
					<div class="min-w-0">
						<p class="truncate text-sm font-semibold">{{ t("userCounter.title") }}</p>
						<p class="truncate text-xs text-muted-foreground">
							{{ t("userCounter.used", { count: userData ? userData.userApiLimitCount : 0, max: MAX_COUNT }) }}
						</p>
					</div>
				</div>
				<div class="my-2.5 h-2 overflow-hidden rounded-full bg-background">
					<Progress v-model="progress"/>
				</div>
				<Button class="h-7 w-full shadow-lg shadow-primary/20 active:scale-[0.98]" @click="upgradeUserToPro">
					<Zap class="size-4" />
					{{ t("userCounter.upgrade") }}
				</Button>
			</div>
			<Button
				class="hidden size-10 rounded-xl p-0 snpm hadow-lg shadow-primary/20 active:scale-[0.98] group-data-[collapsible=icon]:inline-flex"
				:title="t('userCounter.label')"
				:aria-label="t('userCounter.label')"
			>
				<Sparkles class="size-5" />
			</Button>
</template>

<style lang='scss'scoped>
	
</style>
