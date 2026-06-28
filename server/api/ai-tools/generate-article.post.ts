import { validateUserStatus } from "~~/server/utils/validate-user-status";
import { incrementApiLimit } from "~~/server/services/user-api-limit";

export default defineEventHandler(async (event) => {

	const { articleTopic, articleTopicLength, articleNotes } = await readBody(event)

	if (!articleTopic) {

		throw createError({
			statusCode: 400,
			statusMessage: 'Article Topic is required',
		})
	}

	const lengthMap: Record<string, { label: string; tokens: number }> = {
		short: { label: '500-800 words', tokens: 1000 },
		medium: { label: '900-1,200 words', tokens: 1500 },
		long: { label: '1,500-2,000 words', tokens: 2400 },
	}

	const selectedLength = lengthMap[articleTopicLength] || lengthMap.short
	const prompt = [
		`Write a structured article about: ${articleTopic}.`,
		`Target length: ${selectedLength?.label}.`,
		articleNotes ? `Additional notes to include: ${articleNotes}.` : '',
		'Return markdown with a strong title, short intro, useful section headings, practical examples, and a concise conclusion.',
	].filter(Boolean).join('\n')

	try {
		const isPro = await validateUserStatus(event.context.user.id)

		const res = await openai.chat.completions.create({
			model: 'gemini-2.5-flash-lite',
			messages: [
				{
					role: "system",
					content: "You write clear, practical SaaS articles. Avoid hype, avoid generic AI cliches, and keep the structure easy to scan.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.5,
			max_completion_tokens: selectedLength?.tokens,
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
