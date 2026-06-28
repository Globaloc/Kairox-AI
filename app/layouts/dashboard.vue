<script setup lang="ts">
	import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar"
</script>

<template>
	<div class="[--header-height:calc(--spacing(14))]">
		<SidebarProvider class="flex flex-col">
			<DashboardHeader />
			<div class="flex flex-1">
				<DashboardAppSidebar />
				<SidebarInset>
					<slot/>
				</SidebarInset>
			</div>
		</SidebarProvider>
	</div>
</template>

<style lang='scss'scoped>
	
</style>