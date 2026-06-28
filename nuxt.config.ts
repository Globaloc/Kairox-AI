// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
				compatibilityDate: '2025-07-15',
				devtools: { enabled: true },
				css: ['~/assets/css/main.css'],
				runtimeConfig: {
				betterAuthUrl: process.env.BETTER_AUTH_URL,
				betterAuthSecret: process.env.BETTER_AUTH_SECRET,
				tursoDataBaseUrl: process.env.NUXT_TURSO_DATABASE_URL,
				tursoAuthToken: process.env.NUXT_TURSO_AUTH_TOKEN,
				githubClientId: process.env.NUXT_GITHUB_CLIENT_ID,
				githubClientSecret: process.env.NUXT_GITHUB_CLIENT_SECRET,
				googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
				googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
				giminiApiKey: process.env.NUXT_GIMINI_API_KEY,
				cloudinaryCloudName: process.env.NUXT_CLOUDINARY_CLOUD_NAME,
            cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY,
            cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,
				polarAccessToken: process.env.NUXT_POLAR_ACCESS_TOKEN,
				polarServer: process.env.NUXT_POLAR_SERVER,
				polarWebhookSecret: process.env.NUXT_POLAR_WEBHOOK_SECRET,
				polarProductId: process.env.NUXT_POLAR_PRODUCT_ID,
				public: {
					appEnv: process.env.NUXT_PUBLIC_APP_ENV
				}
				},
				eslint: {
								config: {
												stylistic: {
																semi: true,
																quotes: 'double',
																indent: 'tab',
												},
								},
				},
				vite: {
								plugins: [tailwindcss() as any],
				},
				shadcn: {
								prefix: '',
								componentDir: '@/components/ui',
				},
				colorMode: {
								preference: 'system',
								fallback: 'light',
								classSuffix: '',
				},
				modules: [
				 '@nuxt/eslint',
				 '@nuxt/image',
				 'shadcn-nuxt',
				 '@vueuse/nuxt',
				 '@nuxtjs/color-mode',
				 '@nuxtjs/i18n',
				 '@vueuse/motion/nuxt',
				 '@nuxt/icon',
				 '@nuxtjs/mdc',
				],
				i18n: {
					defaultLocale: 'en',
					locales: [
						{ code: 'en', name: 'English', file: 'en.json' },
						{ code: 'ru', name: 'Русский', file: 'ru.json' },
						{ code: 'tt', name: 'Татарча', file: 'tt.json' },
					],
				},
})
