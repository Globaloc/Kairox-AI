import { extractText, getDocumentProxy } from "unpdf";
import { validateUserStatus } from "~~/server/utils/validate-user-status";
import { incrementApiLimit } from "~~/server/services/user-api-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf"];

export default defineEventHandler(async (event) => {
	const formData = await readFormData(event);
	const file = formData.get("resume") as File | null;

	if (!file) {
		throw createError({
			statusCode: 400,
			statusMessage: "Resume file is required",
		});
	}

	if (!ACCEPTED_TYPES.includes(file.type)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Please upload a PDF resume",
		});
	}

	if (file.size > MAX_FILE_SIZE) {
		throw createError({
			statusCode: 400,
			statusMessage: "Please upload a PDF under 5MB",
		});
	}

	let totalPages = 0;
	let resumeText = "";

	try {
		const arrayBuffer = await file.arrayBuffer();
		const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
		const extracted = await extractText(pdf, { mergePages: true });
		totalPages = extracted.totalPages;
		resumeText = extracted.text.trim();
	} catch (error: any) {
		console.error("PDF text extraction failed", {
			message: error?.message,
		});

		throw createError({
			statusCode: 422,
			statusMessage: "We could not read this PDF",
		});
	}

	if (!resumeText) {
		throw createError({
			statusCode: 422,
			statusMessage: "We could not extract readable text from this PDF",
		});
	}

	const prompt = [
		"You are a practical resume reviewer for software and SaaS roles.",
		"Review the resume below and return markdown with these sections:",
		"## Quick verdict",
		"## Strengths",
		"## Weak spots",
		"## Rewrite suggestions",
		"## Missing proof",
		"## Next edits",
		"Be specific, direct, and useful. Do not invent experience that is not present.",
		`PDF pages: ${totalPages}`,
		"Resume text:",
		resumeText,
	].join("\n\n");

	try {
		const isPro = await validateUserStatus(event.context.user.id)
		const res = await openai.chat.completions.create({
			model: "gemini-2.5-flash-lite",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
			temperature: 0.45,
			max_completion_tokens: 1200,
		});

		if (!isPro) {
			await incrementApiLimit(event.context.user.id)
		}
		const content = res.choices[0]?.message.content;

		if (!content) {
			throw createError({
				statusCode: 502,
				statusMessage: "AI response is empty",
			});
		}

		return {
			totalPages,
			review: content,
		};
	} catch (error: any) {
		const statusCode = error?.statusCode || error?.status || 500;
		const message = error?.error?.message || error?.message || "AI request failed";
		const retryAfter = error?.headers?.get?.("retry-after");

		console.error("AI resume review failed", {
			statusCode,
			message,
			code: error?.code,
			type: error?.type,
			retryAfter,
		});

		throw createError({
			statusCode,
			statusMessage: message,
			data: {
				code: error?.code,
				type: error?.type,
				retryAfter,
			},
		});
	}
});
