import { incrementApiLimit } from "~~/server/services/user-api-limit";
import { validateUserStatus } from "~~/server/utils/validate-user-status";

export default defineEventHandler(async (event) => {

	const { messages } = await readBody(event)

	if (!messages) {

		throw createError({
			statusCode: 400,
			statusMessage: 'Messages are required',
		})
	}
	const isPro = await validateUserStatus(event.context.user.id)

	try {
		const res = await openai.chat.completions.create({
			model: 'gemini-2.5-flash-lite',
			messages: [
				{
					role: 'system',
					content: 'You are a helpful assistant.'
				},
				// {
				//       role: "user",
				//       content: messages,
				//   },
				...messages,
			],
			temperature: 0.5,
			max_completion_tokens: 500,
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
