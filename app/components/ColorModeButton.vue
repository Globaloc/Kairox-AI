<script setup lang="ts">
	import { Sun, Moon } from 'lucide-vue-next'
	import { Button } from '@/components/ui/button'

	const colorMode = useColorMode()

	const isDark = computed({
		get() {
			return colorMode.value === 'dark'
		},
		set(_isDark) {
			colorMode.preference = _isDark ? 'dark' : 'light'
		},
	})
</script>

<template>
	<!-- <ClientOnly v-if="!colorMode?.forced"> -->
		<Button
			variant="ghost"
			@click="isDark = !isDark"
			:aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`">
			<Moon
				v-if="!isDark"
				v-motion-fade
				class="stroke-black stroke-2 size-4.5" />
			<Sun
				v-else
				v-motion-fade
				class="fill-yellow-300 stroke-yellow-300 stroke-2 size-4.5" />
		</Button>
	<!-- </ClientOnly> -->
</template>
