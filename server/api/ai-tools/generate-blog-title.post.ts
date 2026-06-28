import { validateUserStatus } from "~~/server/utils/validate-user-status";
import { incrementApiLimit } from "~~/server/services/user-api-limit";

export default defineEventHandler(async (event) => {

	const { blogTopic, blogCategory } = await readBody(event)

	if (!blogTopic) {

		throw createError({
			statusCode: 400,
			statusMessage: 'Blog topic is required',
		})
	}

	if (!blogCategory) {

		throw createError({
			statusCode: 400,
			statusMessage: 'Blog category is required',
		})
	}

	const prompt = [
		`Generate 8 blog title ideas for the keyword: ${blogTopic}.`,
		`Category: ${blogCategory}.`,
		'Return only a numbered markdown list.',
		'Make each title specific, natural, and useful. Avoid generic AI cliches and clickbait.',
	].join('\n')

	try {
		const isPro = await validateUserStatus(event.context.user.id)

		const res = await openai.chat.completions.create({
			model: 'gemini-2.5-flash-lite',
			messages: [
				{
					role: "system",
					content: "You create practical blog title ideas for SaaS and content teams. Keep titles clear, specific, and ready to edit.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.65,
			max_completion_tokens: 350,
		})
		if (!isPro) {
			await incrementApiLimit(event.context.user.id)
		}
		const content = res.choices[0]?.message.content

		if (!content) {
			throw createError({
				statusCode: 502,
				statusMessage: 'AI response is empty',
			})
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
