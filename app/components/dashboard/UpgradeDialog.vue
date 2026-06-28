<script setup lang="ts">
import { toast } from "vue-sonner";
import {
	BookOpenText,
	Check,
	Code2,
	Eraser,
	FileCheck,
	Hash,
	MessageSquare,
	Scissors,
	Sparkles,
	Zap,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

const { isUpgradeDialogOpen, upgradeDialogMessage } = useUpgradeDialog();
const { upgradeUserToPro } = useAuth();
const { t } = useI18n();

const isStartingCheckout = ref(false);

const features = computed(() => [
	{ name: t("dashboardNav.conversation"), icon: MessageSquare },
	{ name: t("dashboardNav.codeGeneration"), icon: Code2 },
	{ name: t("dashboardNav.aiArticleWriter"), icon: BookOpenText },
	{ name: t("dashboardNav.blogTitleGenerator"), icon: Hash },
	{ name: t("dashboardNav.backgroundRemoval"), icon: Eraser },
	{ name: t("dashboardNav.objectRemoval"), icon: Scissors },
	{ name: t("dashboardNav.resumeReviewer"), icon: FileCheck },
]);

const startCheckout = async () => {
	isStartingCheckout.value = true;

	try {
		await upgradeUserToPro();
	} catch {
		toast.error(t("settings.checkoutError"));
		isStartingCheckout.value = false;
	}
};
</script>

<template>
	<Dialog v-model:open="isUpgradeDialogOpen">
		<DialogContent class="overflow-hidden rounded-2xl border-border/70 bg-card p-0 shadow-2xl shadow-primary/10 sm:max-w-md">
			<div class="relative">
				<div class="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/15 blur-3xl" />
				<div class="relative p-6">
					<DialogHeader>
						<div class="flex items-center gap-3">
							<div class="grid size-10 place-items-center rounded-xl bg-primary/15 text-primary">
								<Sparkles class="size-5" />
							</div>
							<div>
								<DialogTitle class="text-xl font-semibold tracking-tight">
									{{ t("upgradeDialog.title") }}
								</DialogTitle>
								<DialogDescription class="mt-1 text-sm leading-6">
									{{ upgradeDialogMessage || t("upgradeDialog.defaultMessage") }}
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div class="upgrade-dialog-scrollbar mt-6 max-h-[60vh] space-y-2.5 overflow-y-auto p-2">
						<div
							v-for="feature in features"
							:key="feature.name"
							class="flex items-center gap-3 rounded-xl bg-background/80 p-3 ring-1 ring-border/70 transition duration-200 hover:bg-secondary/70"
						>
							<div class="grid size-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
								<component :is="feature.icon" class="size-4" />
							</div>
							<span class="flex-1 text-sm font-semibold">{{ feature.name }}</span>
							<Check class="size-4 text-primary" />
						</div>
					</div>

					<Button
						class="mt-6 h-11 w-full shadow-lg shadow-primary/20 active:scale-[0.98]"
						:disabled="isStartingCheckout"
						@click="startCheckout"
					>
						<Zap v-if="!isStartingCheckout" class="size-4" />
						<span
							v-else
							class="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
							aria-hidden="true"
						/>
						{{ isStartingCheckout ? t("upgradeDialog.opening") : t("upgradeDialog.upgrade") }}
					</Button>
				</div>
			</div>
		</DialogContent>
	</Dialog>
</template>

<style scoped>
.upgrade-dialog-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: color-mix(in oklab, var(--primary) 72%, var(--background)) color-mix(in oklab, var(--background) 82%, var(--primary));
}

.upgrade-dialog-scrollbar::-webkit-scrollbar {
	width: 0.5rem;
}

.upgrade-dialog-scrollbar::-webkit-scrollbar-track {
	border-radius: 999px;
	background: color-mix(in oklab, var(--background) 86%, var(--primary));
}

.upgrade-dialog-scrollbar::-webkit-scrollbar-thumb {
	border: 2px solid color-mix(in oklab, var(--background) 86%, var(--primary));
	border-radius: 999px;
	background: color-mix(in oklab, var(--primary) 76%, var(--foreground));
}

.upgrade-dialog-scrollbar::-webkit-scrollbar-thumb:hover {
	background: var(--primary);
}
</style>
