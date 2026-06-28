<script lang="ts" setup>
import * as z from "zod"
import { reactive } from "vue"
import { useForm } from "vee-validate"
import { toTypedSchema } from "@vee-validate/zod"
import { toast } from "vue-sonner";
import { useAuth } from "@/composables/auth-client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const { t } = useI18n();
const localePath = useLocalePath();

const schema = z.object({
	email: z.string().email(t("auth.validation.email")),
	password: z.string()
		.min(8, t("auth.validation.passwordMin"))
		.regex(/[а-яА-Яa-zA-Z]/, { message: t("auth.validation.passwordLetter") })
		.regex(/\d/, { message: t("auth.validation.passwordNumber") }),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	email: '',
	password: '',
})

const { signIn } = useAuth()

const form = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: state,
})

const onSubmit = form.handleSubmit(async (data) => {

	const { error } = await signIn.email({
		email: data.email,
		password: data.password,
		callbackURL: localePath('/dashboard'),
	});

	if (error) {
		toast.error(t("auth.failedLogin"), {
			description: error.message || t("auth.failedLoginDescription"),
		});
		return;
	}

	toast.success(t("auth.successLogin"), {
		description: t("auth.successLoginDescription"),
	});
})
</script>
<template>
	<div class="flex justify-center sm:p-4 w-full">
		<Card class="w-full max-h-115 max-w-xl">
			<CardHeader>
				<CardTitle class="text-center text-xl">
					{{ t("auth.loginTitle") }}
				</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<!-- OAuth -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Button variant="outline" class="gap-2"
						@click="signIn.social({
						provider: 'google',
						callbackURL: localePath('/dashboard')
					})">
						<Icon name="logos:google-icon" size="1.15rem" />
						Google
					</Button>
					<Button variant="outline" class="gap-2" @click="signIn.social({
						provider: 'github',
						callbackURL: localePath('/dashboard')
					})">
						<Icon name="uil:github" size="1.25rem" />
						GitHub
					</Button>
				</div>
				<Separator :label="t('common.or')" />
				<!-- Form -->
				<form @submit.prevent="onSubmit" class="space-y-4">
					<FormField name="email" v-slot="{ field }">
						<FormItem class="w-full">
							<FormLabel>{{ t("auth.email") }}</FormLabel>
							<FormControl>
								<Input v-bind="field" placeholder="you@gmail.com" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField name="password" v-slot="{ field }">
						<FormItem class="w-full">
							<FormLabel>{{ t("auth.password") }}</FormLabel>
							<FormControl>
								<Input type="password" v-bind="field" placeholder="••••••••" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<Button type="submit" class="w-full">
						{{ t("auth.signIn") }}
					</Button>
				</form>
				<div class="text-sm text-center">
					{{ t("auth.dontHaveAccount") }}
					<NuxtLink :to="localePath('/auth/register')" class="ml-1 font-bold text-primary hover:underline">
						{{ t("auth.createNow") }}
					</NuxtLink>
				</div>
			</CardContent>
		</Card>
	</div>
</template>
