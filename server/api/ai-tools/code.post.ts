import { incrementApiLimit } from "~~/server/services/user-api-limit";
import { validateUserStatus } from "~~/server/utils/validate-user-status";
export default defineEventHandler(async (event) => {
	const { messages } = await readBody(event)

	if (!messages || !Array.isArray(messages)) {

		throw createError({
			statusCode: 400,
			statusMessage: 'Messages are required',
		})
	}
	try {
		const isPro = await validateUserStatus(event.context.user.id)
		const res = await openai.chat.completions.create({
			model: 'gemini-2.5-flash-lite',
			messages: [
				{
					role: 'system',
					content: 'You are a practical coding assistant for a Nuxt, Vue 3, TypeScript, and shadcn/vue project. Answer clearly and keep code examples focused. Prefer the existing stack and avoid suggesting new dependencies unless truly needed. Always wrap code in fenced markdown blocks with the most accurate language tag, for example ```vue, ```ts, ```js, ```bash, or ```json. Keep explanation text outside code fences.'
				},
				...messages,
			],
			temperature: 0.5,
			max_completion_tokens: 800,
		})
		const content = res.choices[0]?.message.content

		if (!content) {
			throw createError({
				statusCode: 502,
				statusMessage: 'AI response is empty',
			})
		}

		if (!isPro) {
			await incrementApiLimit(event.context.user.id)
		}

		return content
	} catch (error: any) {
		const statusCode = error?.statusCode || error?.status || 500
		const message = error?.error?.message || error?.message || 'AI request failed'
		const retryAfter = error?.headers?.get?.('retry-after')

		console.error('AI request failed', {
			statusCode,
			message,
			code: error?.code,
			type: error?.type,
			retryAfter,
		})

		throw createError({
			statusCode,
			statusMessage: message,
			data: {
				code: error?.code,
				type: error?.type,
				retryAfter,
			},
		})
	}

})
