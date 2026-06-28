<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";

const colorMode = useColorMode();

const toasterTheme = computed(() => colorMode.value === "dark" ? "dark" : "light");
</script>

<template>
	<ClientOnly>
		<Toaster richColors position="top-center" :theme="toasterTheme" />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
		<DashboardUpgradeDialog />
	</ClientOnly>
</template>
