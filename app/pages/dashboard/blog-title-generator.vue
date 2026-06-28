<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import type { FetchError } from "ofetch";
import { toast } from "vue-sonner";
import { FileText, Hash, Loader2, WandSparkles } from "lucide-vue-next";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

definePageMeta({
	layout: "dashboard",
	middleware: "auth"
});

useHead({
	title: "Blog Title Generator - Kairox AI",
	meta: [{ name: "description", content: "Generate focused blog title ideas from a keyword and category." }],
});

const { t } = useI18n();
const localePath = useLocalePath();

const categoryOptions = [
	"General",
	"Technology",
	"Business",
	"Health",
	"Lifestyle",
	"Education",
	"Travel",
	"Marketing",
	"Finance",
];

const schema = z.object({
	blogTopic: z.string().min(1, t("blog.validationKeyword")),
	blogCategory: z.string().min(1, t("blog.validationCategory")),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	blogTopic: "",
	blogCategory: "General",
});

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: state,
});

const titles = ref("");
const isLoading = ref(false);
const error = ref<AppError | null>(null);
const { openUpgradeDialog } = useUpgradeDialog();

const generateTitles = async (values: Schema) => {
	try {
		isLoading.value = true;
		titles.value = "";

		const data = await $fetch("/api/ai-tools/generate-blog-title", {
			method: "POST",
			body: values,
		});

		if (data) {
			titles.value = data;
		}
	} catch (e) {
		const err = e as FetchError;
		const parsedError = getError(err);
		error.value = parsedError;
		if (parsedError.statusCode === 401) {
			navigateTo(localePath("/auth/login"));
		}

		if (parsedError.statusCode === 403) {
			openUpgradeDialog(parsedError.statusMessage);
			return;
		}

		toast.error(`${parsedError.statusCode} Error`, {
			description: parsedError.statusMessage,
		});
	} finally {
		isLoading.value = false;
	}
};

const onSubmit = handleSubmit((values) => {
	generateTitles(values);
});
</script>

<template>
	<main class="min-h-[calc(100svh-var(--header-height))] bg-background">
		<div class="w-full px-4 py-6 sm:px-6 lg:px-8">
			<section class="space-y-6">
				<header class="rounded-2xl bg-card p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<div
						class="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
						<Hash class="size-4" />
						{{ t("blog.badge") }}
					</div>
					<h1 class="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
						{{ t("blog.title") }}
					</h1>
					<p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
						{{ t("blog.description") }}
					</p>
				</header>

				<Card class="rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<CardContent class="p-5">
						<form class="grid gap-5" @submit.prevent="onSubmit">
							<FormField v-slot="{ componentField }" name="blogTopic">
								<FormItem>
									<FormLabel>{{ t("blog.keyword") }}</FormLabel>
									<FormControl>
										<Input :placeholder="t('blog.keywordPlaceholder')" v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>

							<FormField v-slot="{ componentField }" name="blogCategory">
								<FormItem>
									<FormLabel>{{ t("blog.category") }}</FormLabel>
									<FormControl>
										<select
											class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
											v-bind="componentField">
											<option v-for="category in categoryOptions" :key="category" :value="category">
												{{ t(`blog.categories.${category}`) }}
											</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>

							<div class="flex justify-start">
								<Button type="submit" class="shadow-lg shadow-primary/20 active:scale-[0.98]"
									:disabled="isLoading">
									<Loader2 v-if="isLoading" class="size-4 animate-spin" />
									<WandSparkles v-else class="size-4" />
									{{ isLoading ? t("blog.generating") : t("common.submit") }}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card class="min-h-[18rem] rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<CardContent class="p-5">
						<div v-if="!titles && !isLoading"
							class="flex min-h-[14rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
							<div class="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
								<FileText class="size-6" />
							</div>
							<h2 class="mt-5 text-2xl font-semibold tracking-tight">{{ t("blog.emptyTitle") }}</h2>
							<p class="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
								{{ t("blog.emptyDescription") }}
							</p>
						</div>

						<div v-else-if="isLoading"
							class="flex min-h-[14rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
							<Loader2 class="size-8 animate-spin text-primary" />
							<p class="mt-4 text-sm font-medium text-muted-foreground">{{ t("blog.loading") }}</p>
						</div>

						<div v-else class="title-output rounded-xl bg-muted/40 p-5 text-sm leading-7">
							<MDC :value="titles" />
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	</main>
</template>

<style scoped>
.title-output {
	text-wrap: pretty;
}

.title-output :deep(> * + *) {
	margin-top: 0.85rem;
}

.title-output :deep(ol),
.title-output :deep(ul) {
	display: grid;
	gap: 0.75rem;
	padding-left: 0;
	list-style: none;
}

.title-output :deep(li) {
	border-radius: 0.9rem;
	background: var(--background);
	padding: 0.9rem 1rem;
	color: var(--foreground);
	font-weight: 500;
	line-height: 1.55;
	box-shadow: inset 0 0 0 1px var(--border);
}

.title-output :deep(p) {
	color: var(--muted-foreground);
}
</style>
