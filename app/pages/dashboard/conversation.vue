<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Bot, CornerDownLeft, MessageSquare, Sparkles, UserRound } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import type { FetchError } from "ofetch"
import { toast } from "vue-sonner";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea"

definePageMeta({
	layout: "dashboard",
	middleware: "auth"
});

useHead({
	title: "Conversation - Kairox AI",
	meta: [{ name: "description", content: "Chat with Kairox AI and prepare prompts for your SaaS workflows." }],
});

const { t } = useI18n();
const localePath = useLocalePath();

type Message = {
	role: "system" | "user";
	content: string;
};

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	userPrompt: "",
});

const schema = z.object({
	userPrompt: z.string().min(1, t("chat.promptRequired")),
});

const { handleSubmit, resetForm, setFieldValue } = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: state
})

const suggestions = computed(() => [
	t("chat.suggestions.feedback"),
	t("chat.suggestions.checklist"),
	t("chat.suggestions.compare"),
]);


const messages = ref<Message[]>([
	// {
	// 	role: "system",
	// 	content: "Tell me what you are building, what the user should get, and the tone you want. I can help turn rough notes into a usable plan.",
	// },
	// {
	// 	role: "user",
	// 	content: "I need a cleaner onboarding flow for a small AI SaaS dashboard.",
	// },
	// {
	// 	role: "system",
	// 	content: "Start with three steps: connect data, choose a workflow, run the first generation. Keep billing and model settings outside the first pass.",
	// },
]);


const isLoading = ref(false)
const error = ref<AppError | null>(null)
const { openUpgradeDialog } = useUpgradeDialog();

const sendMessage = async (userPrompt: string) => {
	try {
		isLoading.value = true
		messages.value.push({
			role: "user",
			content: userPrompt,
		})

		const data = await $fetch('/api/ai-tools/conversation', {
			method: 'POST',
			body: {
				messages: messages.value,
			}
		})

		if (data) {
			messages.value.push({
				role: "system",
				content: data
			})
		}
		resetForm()
	} catch (e) {
		const err = e as FetchError
		const parsedError = getError(err)
		error.value = parsedError
		if (parsedError.statusCode === 401) {
			navigateTo(localePath("/auth/login"));
		}

		if (parsedError.statusCode === 403) {
			openUpgradeDialog(parsedError.statusMessage);
			return;
		}

		toast.error(`${parsedError.statusCode} Error`, {
			description: parsedError.statusMessage,
		})
	} finally {
		isLoading.value = false
	}
}

const onSubmit = handleSubmit((values) => {
	sendMessage(values.userPrompt)
})
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
								<MessageSquare class="size-4" />
								{{ t("dashboardNav.conversation") }}
							</div>
							<h1 class="mt-4 text-balance text-3xl font-semibold tracking-tight">{{ t("chat.conversationTitle") }}</h1>
							<p class="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
								{{ t("chat.conversationDescription") }}
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
							<MessageSquare class="size-6" />
						</div>
						<h2 class="mt-5 text-2xl font-semibold tracking-tight">{{ t("chat.conversationEmptyTitle") }}</h2>
						<p class="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
							{{ t("chat.conversationEmptyDescription") }}
						</p>
						<div class="mt-6 grid w-full gap-3 sm:grid-cols-3">
							<button v-for="suggestion in suggestions" :key="suggestion" type="button"
								class="rounded-xl bg-muted/70 p-4 text-left text-sm leading-6 transition hover:bg-accent hover:text-accent-foreground active:scale-[0.99]"
								@click="setFieldValue('userPrompt', suggestion)">
								{{ suggestion }}
							</button>
						</div>
					</div>

					<div v-for="message in messages" :key="message.content" class="flex gap-3"
						:class="message.role === 'user' ? 'justify-end' : 'justify-start'">
						<div v-if="message.role !== 'user'"
							class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
							<Bot class="size-5" />
						</div>
						<div class="max-w-[46rem] rounded-2xl px-4 py-3 text-sm leading-6"
							:class="message.role === 'user' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/70 text-foreground'">
							<MDC :value="message.content" />
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
							{{ t("chat.conversationThinking") }}
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
											:placeholder="t('chat.conversationPlaceholder')"
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
