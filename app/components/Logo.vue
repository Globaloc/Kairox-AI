<script setup lang="ts">
const localePath = useLocalePath()
const { t } = useI18n()

</script>

<template>
	<NuxtLink :to="localePath('/')" class="flex items-center gap-3 select-none">
		<NuxtImg src="/Kairox.svg" class="size-6" alt="Kairox AI" />
		<div class="flex flex-col justify-center text-sm">
			<p class="font-bold">Kairox AI</p>
			<span class="text-xs text-muted-foreground">{{ t("header.workspaceSubtitle") }}</span>
		</div>
	</NuxtLink>
</template>

<style lang='scss' scoped></style>
