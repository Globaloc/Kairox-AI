<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { ImageIcon, Loader2, Scissors, Upload } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { FetchError } from "ofetch";
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
	title: "Object Removal - Kairox AI",
	meta: [{ name: "description", content: "Upload an image and describe the object you want removed." }],
});

const { t } = useI18n();
const localePath = useLocalePath();

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif"];

const schema = z.object({
	objectPrompt: z.string().min(1, t("imageTools.errors.objectRequired")),
	image: z.custom<File>(
		(value) => typeof File !== "undefined" && value instanceof File,
		t("imageTools.errors.imageRequired"),
	),
});

type Schema = z.output<typeof schema>;

const { handleSubmit, setFieldError, setFieldValue } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: {
		objectPrompt: "",
		image: undefined,
	},
});

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const previewUrl = ref("");
const resultUrl = ref("");
const resultBaseUrl = ref("");
const isProcessing = ref(false);
const resultRetryCount = ref(0);
const { openUpgradeDialog } = useUpgradeDialog();

const openFilePicker = () => {
	fileInput.value?.click();
};

const clearPreviewUrl = () => {
	if (previewUrl.value) {
		URL.revokeObjectURL(previewUrl.value);
	}
};

const clearSelectedImage = () => {
	clearPreviewUrl();
	selectedFile.value = null;
	previewUrl.value = "";
	resultUrl.value = "";
	resultBaseUrl.value = "";
	resultRetryCount.value = 0;
	setFieldValue("image", undefined);
};

const handleFileChange = (event: Event) => {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];

	if (!file) {
		return;
	}

	if (!ACCEPTED_TYPES.includes(file.type)) {
		clearSelectedImage();
		setFieldError("image", t("imageTools.errors.unsupported"));
		toast.error(t("common.unsupportedImageType"), {
			description: t("imageTools.errors.unsupported"),
		});
		input.value = "";
		return;
	}

	if (file.size > MAX_FILE_SIZE) {
		clearSelectedImage();
		setFieldError("image", t("imageTools.errors.tooLarge"));
		toast.error(t("common.imageTooLarge"), {
			description: t("imageTools.errors.tooLarge"),
		});
		input.value = "";
		return;
	}

	clearPreviewUrl();
	selectedFile.value = file;
	previewUrl.value = URL.createObjectURL(file);
	resultUrl.value = "";
	resultBaseUrl.value = "";
	resultRetryCount.value = 0;
	setFieldValue("image", file);
	setFieldError("image", undefined);
};

const removeObject = async (values: Schema) => {
	try {
		isProcessing.value = true;
		resultUrl.value = "";
		resultBaseUrl.value = "";
		resultRetryCount.value = 0;

		const formData = new FormData();
		formData.append("objectPrompt", values.objectPrompt);
		formData.append("image", values.image);

		const data = await $fetch<{ secureUrl: string }>("/api/cloudinary-tools/remove-object", {
			method: "POST",
			body: formData,
		});

		if (!data.secureUrl) {
			toast.error(t("common.cloudinaryInvalid"), {
				description: t("imageTools.errors.invalidResponse"),
			});
			return;
		}

		resultBaseUrl.value = data.secureUrl;
		resultUrl.value = data.secureUrl;
		toast.success(t("imageTools.object.started"), {
			description: t("imageTools.object.startedDescription"),
		});
	} catch (e) {
		const err = e as FetchError;
		const parsedError = getError(err);
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
		isProcessing.value = false;
	}
};

const onSubmit = handleSubmit((values) => {
	removeObject(values);
});

const handleResultImageError = () => {
	if (!resultBaseUrl.value || resultRetryCount.value >= 5) {
		toast.error(t("common.stillProcessing"), {
			description: t("imageTools.errors.processing"),
		});
		return;
	}

	resultRetryCount.value += 1;
	setTimeout(() => {
		resultUrl.value = `${resultBaseUrl.value}?retry=${Date.now()}`;
	}, 1500);
};

onBeforeUnmount(() => {
	clearPreviewUrl();
});
</script>

<template>
	<main class="min-h-[calc(100svh-var(--header-height))] bg-background">
		<div class="w-full px-4 py-6 sm:px-6 lg:px-8">
			<section class="space-y-6">
				<header class="rounded-2xl bg-card p-6 shadow-sm shadow-primary/5 ring-1 ring-border/70">
					<div
						class="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
						<Scissors class="size-4" />
						{{ t("imageTools.object.badge") }}
					</div>
					<h1 class="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
						{{ t("imageTools.object.title") }}
					</h1>
					<p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
						{{ t("imageTools.object.description") }}
					</p>
				</header>

				<div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
					<Card class="rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
						<CardContent class="p-5">
							<form class="grid gap-5" @submit.prevent="onSubmit">
								<FormField v-slot="{ componentField }" name="objectPrompt">
									<FormItem>
										<FormLabel>{{ t("imageTools.object.prompt") }}</FormLabel>
										<FormControl>
											<Input :placeholder="t('imageTools.object.promptPlaceholder')"
												v-bind="componentField" />
										</FormControl>
										<FormMessage />
									</FormItem>
								</FormField>

								<FormField name="image">
									<FormItem>
										<div class="space-y-2">
											<div>
												<p class="text-sm font-medium">{{ t("imageTools.image") }}</p>
												<p class="text-sm text-muted-foreground">{{ t("imageTools.imageHint") }}</p>
											</div>

											<button type="button"
												class="group flex min-h-56 w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/70 p-6 text-center transition hover:border-primary/60 hover:bg-primary/5"
												@click="openFilePicker">
												<input ref="fileInput" type="file" accept="image/jpeg,image/png,image/gif"
													class="hidden" @change="handleFileChange">
													<img v-if="previewUrl" :src="previewUrl"
														:alt="selectedFile?.name || t('imageTools.selectedPreview')"
														class="max-h-48 rounded-lg object-contain">
													<div v-else
														class="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
														<Upload class="size-5" />
													</div>
													<p v-if="selectedFile" class="mt-3 max-w-full truncate text-sm font-medium">
														{{ selectedFile.name }}
													</p>
											</button>
										</div>
										<FormMessage />
									</FormItem>
								</FormField>

								<div class="flex justify-start">
									<Button type="submit" class="shadow-lg shadow-primary/20 active:scale-[0.98]"
										:disabled="isProcessing">
										<Loader2 v-if="isProcessing" class="size-4 animate-spin" />
										<Scissors v-else class="size-4" />
										{{ isProcessing ? t("imageTools.removing") : t("common.submit") }}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>

					<Card class="min-h-[31rem] rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
						<CardContent class="h-full p-5">
							<div v-if="!resultUrl && !isProcessing"
								class="flex min-h-[28rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
								<div class="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
									<ImageIcon class="size-6" />
								</div>
								<h2 class="mt-5 text-2xl font-semibold tracking-tight">{{ t("imageTools.object.previewTitle") }}</h2>
								<p class="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
									{{ t("imageTools.object.previewDescription") }}
								</p>
							</div>

							<div v-else-if="isProcessing"
								class="flex min-h-[28rem] flex-col items-center justify-center rounded-xl bg-muted/40 p-8 text-center">
								<Loader2 class="size-8 animate-spin text-primary" />
								<p class="mt-4 text-sm font-medium text-muted-foreground">
									{{ t("imageTools.object.processing") }}
								</p>
							</div>

							<div v-else class="grid min-h-[28rem] place-items-center rounded-xl bg-muted/40 p-6">
								<img :src="resultUrl" :alt="selectedFile?.name || t('imageTools.object.resultAlt')"
									class="max-h-[30rem] rounded-xl object-contain shadow-xl shadow-primary/10"
									@error="handleResultImageError">
							</div>
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	</main>
</template>
