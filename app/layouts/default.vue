<script setup>

</script>

<template>
	<div class="relative flex min-h-dvh w-full flex-col overflow-x-hidden">
		<!-- Navbar -->
		<Header/>
		<main id="content" class="flex w-full flex-1">
			<slot />
		</main>
	</div>
</template>

<style lang='scss' scoped></style>
