<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import type { FetchError } from "ofetch";
import { toast } from "vue-sonner";
import { BookOpenText, FileText, Loader2, WandSparkles } from "lucide-vue-next";
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
	title: "AI Article Writer - Kairox AI",
	meta: [{ name: "description", content: "Draft structured articles from a topic, length, and short writing notes." }],
});

const { t } = useI18n();
const localePath = useLocalePath();

const lengthOptions = computed(() => [
	{ label: t("article.lengths.short"), value: "short" },
	{ label: t("article.lengths.medium"), value: "medium" },
	{ label: t("article.lengths.long"), value: "long" },
]);

const schema = z.object({
	articleTopic: z.string().min(1, t("article.validationTopic")),
	articleTopicLength: z.enum(["short", "medium", "long"]),
	articleNotes: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	articleTopic: "",
	articleTopicLength: "short",
	articleNotes: "",
});

const { handleSubmit } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: state,
});

const article = ref("");
const isLoading = ref(false);
const error = ref<AppError | null>(null);
const { openUpgradeDialog } = useUpgradeDialog();

const generateArticle = async (values: Schema) => {
	try {
		isLoading.value = true;
		article.value = "";

		const data = await $fetch("/api/ai-tools/generate-article", {
			method: "POST",
			body: values,
		});

		if (data) {
			article.value = data;
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
	generateArticle(values);
});
</script>

<template>
	<main class="min-h-[calc(100svh-var(--header-height))] bg-background">
		<div class="w-full px-4 py-6 sm:px-6 lg:px-8">
			<section class="space-y-6">
				<header class="rounded-2xl bg-card p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<div
						class="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
						<BookOpenText class="size-4" />
						{{ t("article.badge") }}
					</div>
					<h1 class="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
						{{ t("article.title") }}
					</h1>
					<p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
						{{ t("article.description") }}
					</p>
				</header>

				<Card class="rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<CardContent class="p-5">
						<form class="grid gap-5" @submit.prevent="onSubmit">
							<FormField v-slot="{ componentField }" name="articleTopic">
								<FormItem>
									<FormLabel>{{ t("article.topic") }}</FormLabel>
									<FormControl>
										<Input :placeholder="t('article.topicPlaceholder')"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>

							<FormField v-slot="{ componentField }" name="articleTopicLength">
								<FormItem>
									<FormLabel>{{ t("article.length") }}</FormLabel>
									<FormControl>
										<select
											class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
											v-bind="componentField">
											<option v-for="option in lengthOptions" :key="option.value" :value="option.value">
												{{ option.label }}
											</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>

							<FormField v-slot="{ componentField }" name="articleNotes">
								<FormItem>
									<FormLabel>{{ t("article.notes") }}</FormLabel>
									<FormControl>
										<Textarea class="min-h-28 resize-none"
											:placeholder="t('article.notesPlaceholder')"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>

							<div class="flex justify-start">
								<Button type="submit" class="shadow-lg shadow-primary/20 active:scale-[0.98]"
									:disabled="isLoading">
									<Loader2 v-if="isLoading" class="size-4 animate-spin" />
									<WandSparkles v-else class="size-4" />
									{{ isLoading ? t("article.writing") : t("common.submit") }}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card class="min-h-[34rem] rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<CardContent class="p-5">
						<div v-if="!article && !isLoading"
							class="flex min-h-[30rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
							<div class="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
								<FileText class="size-6" />
							</div>
							<h2 class="mt-5 text-2xl font-semibold tracking-tight">{{ t("article.emptyTitle") }}</h2>
							<p class="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
								{{ t("article.emptyDescription") }}
							</p>
						</div>

						<div v-else-if="isLoading"
							class="flex min-h-[30rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
							<Loader2 class="size-8 animate-spin text-primary" />
							<p class="mt-4 text-sm font-medium text-muted-foreground">{{ t("article.loading") }}</p>
						</div>

						<article v-else class="article-output rounded-xl bg-muted/40 p-5 text-sm leading-7">
							<MDC :value="article" />
						</article>
					</CardContent>
				</Card>
			</section>
		</div>
	</main>
</template>

<style scoped>
.article-output {
	text-wrap: pretty;
}

.article-output :deep(> * + *) {
	margin-top: 1rem;
}

.article-output :deep(h1),
.article-output :deep(h2),
.article-output :deep(h3) {
	color: var(--foreground);
	font-weight: 650;
	letter-spacing: -0.03em;
	line-height: 1.15;
}

.article-output :deep(h1) {
	font-size: 2rem;
}

.article-output :deep(h2) {
	font-size: 1.45rem;
}

.article-output :deep(h3) {
	font-size: 1.15rem;
}

.article-output :deep(p),
.article-output :deep(li) {
	color: var(--muted-foreground);
}

.article-output :deep(ul),
.article-output :deep(ol) {
	padding-left: 1.25rem;
}

.article-output :deep(ul) {
	list-style: disc;
}

.article-output :deep(ol) {
	list-style: decimal;
}
</style>
