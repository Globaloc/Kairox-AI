<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import type { FetchError } from "ofetch";
import { toast } from "vue-sonner";
import { FileCheck, FileText, Loader2, Upload } from "lucide-vue-next";
import {
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

definePageMeta({
	layout: "dashboard",
	middleware: "auth"
});

useHead({
	title: "Resume Reviewer - Kairox AI",
	meta: [{ name: "description", content: "Upload a PDF resume and get practical AI feedback." }],
});

const { t } = useI18n();
const localePath = useLocalePath();

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf"];

const schema = z.object({
	resume: z.custom<File>(
		(value) => typeof File !== "undefined" && value instanceof File,
		t("resume.errors.required"),
	),
});

type Schema = z.output<typeof schema>;

const { handleSubmit, setFieldError, setFieldValue } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		resume: undefined,
	},
});

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const review = ref("");
const totalPages = ref<number | null>(null);
const isLoading = ref(false);
const error = ref<AppError | null>(null);
const { openUpgradeDialog } = useUpgradeDialog();

const openFilePicker = () => {
	fileInput.value?.click();
};

const clearSelectedFile = () => {
	selectedFile.value = null;
	review.value = "";
	totalPages.value = null;
	setFieldValue("resume", undefined);
};

const handleFileChange = (event: Event) => {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];

	if (!file) {
		return;
	}

	if (!ACCEPTED_TYPES.includes(file.type)) {
		clearSelectedFile();
		setFieldError("resume", t("resume.errors.unsupported"));
		toast.error(t("common.unsupportedFileType"), {
			description: t("resume.errors.unsupported"),
		});
		input.value = "";
		return;
	}

	if (file.size > MAX_FILE_SIZE) {
		clearSelectedFile();
		setFieldError("resume", t("resume.errors.tooLarge"));
		toast.error(t("common.imageTooLarge"), {
			description: t("resume.errors.tooLarge"),
		});
		input.value = "";
		return;
	}

	selectedFile.value = file;
	review.value = "";
	totalPages.value = null;
	setFieldValue("resume", file);
	setFieldError("resume", undefined);
};

const reviewResume = async (values: Schema) => {
	try {
		isLoading.value = true;
		review.value = "";
		totalPages.value = null;

		const formData = new FormData();
		formData.append("resume", values.resume);

		const data = await $fetch<{ totalPages: number; review: string }>("/api/ai-tools/review-resume", {
			method: "POST",
			body: formData,
		});

		review.value = data.review;
		totalPages.value = data.totalPages;
		toast.success(t("resume.reviewed"), {
			description: t("resume.reviewedDescription"),
		});
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
	reviewResume(values);
});
</script>

<template>
	<main class="min-h-[calc(100svh-var(--header-height))] bg-background">
		<div class="w-full px-4 py-6 sm:px-6 lg:px-8">
			<section class="space-y-6">
				<header class="rounded-2xl bg-card p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<div
						class="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
						<FileCheck class="size-4" />
						{{ t("resume.badge") }}
					</div>
					<h1 class="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
						{{ t("resume.title") }}
					</h1>
					<p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
						{{ t("resume.description") }}
					</p>
				</header>

				<Card class="rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<CardContent class="p-5">
						<form class="grid gap-5" @submit.prevent="onSubmit">
							<FormField name="resume">
								<FormItem>
									<div class="space-y-2">
										<div>
											<p class="text-sm font-medium">{{ t("resume.file") }}</p>
											<p class="text-sm text-muted-foreground">{{ t("resume.fileHint") }}</p>
										</div>

										<button type="button"
											class="group flex min-h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/70 p-6 text-center transition hover:border-primary/60 hover:bg-primary/5"
											@click="openFilePicker">
											<input ref="fileInput" type="file" accept="application/pdf,.pdf" class="hidden"
												@change="handleFileChange">
											<div
												class="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
												<Upload class="size-5" />
											</div>
											<p v-if="selectedFile" class="mt-3 max-w-full truncate text-sm font-medium">
												{{ selectedFile.name }}
											</p>
											<p v-else class="mt-3 text-sm text-muted-foreground">
												{{ t("resume.upload") }}
											</p>
										</button>
									</div>
									<FormMessage />
								</FormItem>
							</FormField>

							<div class="flex justify-start">
								<Button type="submit" class="shadow-lg shadow-primary/20 active:scale-[0.98]"
									:disabled="isLoading">
									<Loader2 v-if="isLoading" class="size-4 animate-spin" />
									<FileCheck v-else class="size-4" />
									{{ isLoading ? t("resume.reviewing") : t("common.submit") }}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				<Card class="min-h-[28rem] rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<CardContent class="p-5">
						<div v-if="!review && !isLoading"
							class="flex min-h-[24rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
							<div class="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
								<FileText class="size-6" />
							</div>
							<h2 class="mt-5 text-2xl font-semibold tracking-tight">{{ t("resume.emptyTitle") }}</h2>
							<p class="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
								{{ t("resume.emptyDescription") }}
							</p>
						</div>

						<div v-else-if="isLoading"
							class="flex min-h-[24rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
							<Loader2 class="size-8 animate-spin text-primary" />
							<p class="mt-4 text-sm font-medium text-muted-foreground">{{ t("resume.loading") }}</p>
						</div>

						<article v-else class="resume-output rounded-xl bg-muted/40 p-5 text-sm leading-7">
							<p v-if="totalPages" class="mb-4 text-xs font-medium text-muted-foreground">
								{{ t("resume.analyzed", totalPages) }}
							</p>
							<MDC :value="review" />
						</article>
					</CardContent>
				</Card>
			</section>
		</div>
	</main>
</template>

<style scoped>
.resume-output {
	text-wrap: pretty;
}

.resume-output :deep(> * + *) {
	margin-top: 1rem;
}

.resume-output :deep(h1),
.resume-output :deep(h2),
.resume-output :deep(h3) {
	color: var(--foreground);
	font-weight: 650;
	letter-spacing: -0.03em;
	line-height: 1.15;
}

.resume-output :deep(h1) {
	font-size: 2rem;
}

.resume-output :deep(h2) {
	font-size: 1.45rem;
}

.resume-output :deep(h3) {
	font-size: 1.15rem;
}

.resume-output :deep(p),
.resume-output :deep(li) {
	color: var(--muted-foreground);
}

.resume-output :deep(ul),
.resume-output :deep(ol) {
	padding-left: 1.25rem;
}

.resume-output :deep(ul) {
	list-style: disc;
}

.resume-output :deep(ol) {
	list-style: decimal;
}
</style>
