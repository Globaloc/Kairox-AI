<script lang="ts" setup>
import * as z from "zod";
import { reactive } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import { useAuth } from "@/composables/auth-client";


import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const { t } = useI18n();
const localePath = useLocalePath();

const schema = z.object({
	name: z
		.string({
			required_error: t("auth.validation.nameRequired"),
		})
		.min(2, {
			message: t("auth.validation.nameMin"),
		}),
	email: z.string().email(t("auth.validation.email")),
	password: z.string()
		.min(8, t("auth.validation.passwordMin"))
		.regex(/[а-яА-Яa-zA-Z]/, { message: t("auth.validation.passwordLetter") })
		.regex(/\d/, { message: t("auth.validation.passwordNumber") }),
	confirmPassword: z.string({ required_error: t("auth.validation.required") }),
}).refine(data => data.password === data.confirmPassword, {
	message: t("auth.validation.passwordsMatch"),
	path: ["confirmPassword"],
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
	name: "",
	email: "",
	password: "",
	// confirmPassword: "",
});

const form = useForm({
	validationSchema: toTypedSchema(schema),
	initialValues: state,
});

const { signIn, signUp } = useAuth()

const onSubmit = form.handleSubmit(async (data) => {

	const { error } = await signUp.email({
		name: data.name,
		email: data.email,
		password: data.password,
		callbackURL: localePath('/dashboard'),
	});

	if (error) {
		toast.error(t("auth.failedRegister"), {
			description: error.message || t("auth.failedRegisterDescription"),
		});
		return;
	}

	toast.success(t("auth.successRegister"), {
		description: t("auth.successRegisterDescription"),
	});
});
</script>

<template>
	<div class="flex justify-center sm:p-4 w-full">
		<Card class="w-full max-h-115 max-w-xl">
			<CardHeader>
				<CardTitle class="text-center text-xl">
					{{ t("auth.registerTitle") }}
				</CardTitle>
			</CardHeader>

			<CardContent class="space-y-4">
				<!-- OAuth buttons -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<Button variant="outline" class="gap-2"
						@click="signIn.social({
						provider: 'google',
						callbackURL: localePath('/')
					})">
						<Icon name="logos:google-icon" size="1.15rem" />
						Google
					</Button>
					<Button variant="outline" class="gap-2" 
					@click="signIn.social({
						provider: 'github',
						callbackURL: localePath('/')
					})">
						<Icon name="uil:github" size="1.25rem" />
						GitHub
					</Button>
				</div>

				<Separator :label="t('common.or')" />

				<!-- Form -->
				<form class="space-y-5" @submit.prevent="onSubmit">
					<div class="space-y-4">
						<div class="flex gap-3 items-start flex-col sm:flex-row">
							<FormField v-slot="{ field }" name="name">
								<FormItem class="w-full">
									<FormLabel>{{ t("auth.name") }}</FormLabel>
									<FormControl>
										<Input v-bind="field" :placeholder="t('auth.firstNamePlaceholder')" class="w-full" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
							<FormField v-slot="{ field }" name="email">
								<FormItem class="w-full">
									<FormLabel>{{ t("auth.email") }}</FormLabel>
									<FormControl>
										<Input v-bind="field" placeholder="you@gmail.com" class="w-full" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
						<div class="flex gap-3 items-start flex-col sm:flex-row">
							<FormField v-slot="{ field }" name="password">
								<FormItem class="w-full">
									<FormLabel>{{ t("auth.password") }}</FormLabel>
									<FormControl>
										<Input type="password" v-bind="field" placeholder="••••••••" class="w-full" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
							<FormField v-slot="{ field }" name="confirmPassword">
								<FormItem class="w-full">
									<FormLabel>{{ t("auth.confirmPassword") }}</FormLabel>
									<FormControl>
										<Input type="password" v-bind="field" placeholder="••••••••" class="w-full" />
									</FormControl>
									<FormMessage />
								</FormItem>
							</FormField>
						</div>
					</div>

					<Button type="submit" class="w-full">
						{{ t("auth.createAccount") }}
					</Button>

					<div class="text-sm text-center">
						{{ t("auth.alreadyHaveAccount") }}
						<NuxtLink :to="localePath('/auth/login')" class="ml-1 font-bold text-primary hover:underline">
							{{ t("auth.signIn") }}
						</NuxtLink>
					</div>
				</form>
			</CardContent>
		</Card>
	</div>
</template>

<style lang='scss' scoped></style>
