<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Bot, Code2, CornerDownLeft, Sparkles, UserRound } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import type { FetchError } from "ofetch";
import { toast } from "vue-sonner";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

definePageMeta({
	layout: "dashboard",
	middleware: "auth"
});

useHead({
	title: "Code Chat - Kairox AI",
	meta: [{ name: "description", content: "Chat with Kairox AI about code, components, APIs, and refactors." }],
});

const { t } = useI18n();
const localePath = useLocalePath();

type Message = {
	role: "assistant" | "user";
	content: string;
};

type Schema = z.output<typeof schema>;

const schema = z.object({
	userPrompt: z.string().min(1, t("chat.promptRequired")),
});

const state = reactive<Schema>({
	userPrompt: "",
});

const { handleSubmit, resetForm, setFieldValue } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: state,
});

const suggestions = computed(() => [
	t("chat.suggestions.nuxtRoute"),
	t("chat.suggestions.splitVue"),
	t("chat.suggestions.reviewHelper"),
]);

const messages = ref<Message[]>([]);
const isLoading = ref(false);
const { openUpgradeDialog } = useUpgradeDialog();

const sendMessage = async (userPrompt: string) => {
	try {
		isLoading.value = true;
		messages.value.push({
			role: "user",
			content: userPrompt,
		});

		const data = await $fetch("/api/ai-tools/code", {
			method: "POST",
			body: {
				messages: messages.value,
			},
		});

		if (data) {
			messages.value.push({
				role: "assistant",
				content: data,
			});
		}

		resetForm();
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
		isLoading.value = false;
	}
};

const onSubmit = handleSubmit((values) => {
	sendMessage(values.userPrompt);
});
</script>

<template>
	<main class="min-h-[calc(100svh-var(--header-height))] bg-background">
		<div class="w-full px-4 py-6 sm:px-6 lg:px-8">
			<section
				class="flex min-h-[calc(100svh-8rem)] flex-col overflow-hidden rounded-2xl bg-card shadow-sm shadow-primary/5 ring-1 ring-border/70">
				<header class="border-b border-border/70 p-5">
					<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<div
								class="inline-flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
								<Code2 class="size-4" />
								{{ t("chat.codeBadge") }}
							</div>
							<h1 class="mt-4 text-balance text-3xl font-semibold tracking-tight">
								{{ t("chat.codeTitle") }}
							</h1>
							<p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
								{{ t("chat.codeDescription") }}
							</p>
						</div>
						<Button class="shadow-lg shadow-primary/20 active:scale-[0.98]" @click="messages = []">
							<Sparkles class="size-4" />
							{{ t("common.newChat") }}
						</Button>
					</div>
				</header>

				<div class="flex-1 space-y-4 overflow-y-auto p-5">
					<div v-if="messages.length === 0"
						class="mx-auto flex max-w-2xl flex-col items-center justify-center py-16 text-center">
						<div class="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
							<Code2 class="size-6" />
						</div>
						<h2 class="mt-5 text-2xl font-semibold tracking-tight">{{ t("chat.codeEmptyTitle") }}</h2>
						<p class="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
							{{ t("chat.codeEmptyDescription") }}
						</p>
						<div class="mt-6 grid w-full gap-3 sm:grid-cols-3">
							<button v-for="suggestion in suggestions" :key="suggestion" type="button"
								class="rounded-xl bg-muted/70 p-4 text-left text-sm leading-6 transition hover:bg-accent hover:text-accent-foreground active:scale-[0.99]"
								@click="setFieldValue('userPrompt', suggestion)">
								{{ suggestion }}
							</button>
						</div>
					</div>

					<div v-for="message in messages" :key="`${message.role}-${message.content}`" class="flex gap-3"
						:class="message.role === 'user' ? 'justify-end' : 'justify-start'">
						<div v-if="message.role !== 'user'"
							class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
							<Bot class="size-5" />
						</div>
						<div class="max-w-[46rem] rounded-2xl px-4 py-3 text-sm leading-6"
							:class="message.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/70 text-foreground'">
							<span v-if="message.role === 'user'">{{ message.content }}</span>
							<MDC v-else class="markdown-content" :value="message.content" />
						</div>
						<div v-if="message.role === 'user'"
							class="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
							<UserRound class="size-5" />
						</div>
					</div>

					<div v-if="isLoading" class="flex gap-3">
						<div class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
							<Bot class="size-5" />
						</div>
						<div class="rounded-2xl bg-muted/70 px-4 py-3 text-sm text-muted-foreground">
							{{ t("chat.codeThinking") }}
						</div>
					</div>
				</div>

				<footer class="border-t border-border/70 p-4">
					<div class="rounded-xl bg-background p-3 ring-1 ring-border/70">
						<form class="space-y-4" @submit.prevent="onSubmit">
							<FormField v-slot="{ componentField }" name="userPrompt">
								<FormItem>
									<FormControl>
										<Textarea
											class="min-h-24 w-full resize-none bg-transparent p-2 text-sm leading-6 outline-none placeholder:text-muted-foreground"
											:placeholder="t('chat.codePlaceholder')"
											v-bind="componentField" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
							<div class="flex items-center justify-end gap-3">
								<Button size="sm" type="submit" class="shadow-lg shadow-primary/20" :disabled="isLoading">
									{{ t("common.send") }}
									<CornerDownLeft class="size-4" />
								</Button>
							</div>
						</form>
					</div>
				</footer>
			</section>
		</div>
	</main>
</template>

<style scoped>
.markdown-content {
	display: block;
	max-width: 100%;
}

.markdown-content :deep(> * + *) {
	margin-top: 0.85rem;
}

.markdown-content :deep(p) {
	text-wrap: pretty;
}

.markdown-content :deep(pre) {
	position: relative;
	margin: 1rem 0;
	overflow-x: auto;
	border: 1px solid color-mix(in oklab, var(--border) 82%, var(--primary) 18%);
	border-radius: 1rem;
	background:
		linear-gradient(180deg, color-mix(in oklab, var(--foreground) 9%, transparent), transparent 3rem),
		color-mix(in oklab, var(--background) 88%, black 12%);
	padding: 3.15rem 1.25rem 1.25rem;
	box-shadow: inset 0 1px 0 color-mix(in oklab, white 8%, transparent);
}

.markdown-content :deep(pre)::before {
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	display: flex;
	height: 2.35rem;
	align-items: center;
	border-bottom: 1px solid color-mix(in oklab, var(--border) 72%, transparent);
	padding: 0 1rem;
	color: var(--muted-foreground);
	content: "Code";
	font-family: var(--font-sans);
	font-size: 0.78rem;
	font-weight: 600;
	letter-spacing: 0.02em;
}

.markdown-content :deep(pre code) {
	display: block;
	min-width: max-content;
	background: transparent;
	color: var(--foreground);
	font-family: var(--font-mono);
	font-size: 0.84rem;
	line-height: 1.75;
	tab-size: 2;
	white-space: pre;
}

.markdown-content :deep(:not(pre) > code) {
	border-radius: 0.35rem;
	background: color-mix(in oklab, var(--foreground) 12%, transparent);
	padding: 0.1rem 0.35rem;
	color: var(--foreground);
	font-family: var(--font-mono);
	font-size: 0.86em;
}
</style>
