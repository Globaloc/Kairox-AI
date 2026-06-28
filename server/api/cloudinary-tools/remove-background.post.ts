import type { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { incrementApiLimit } from "~~/server/services/user-api-limit";
import { validateUserStatus } from "~~/server/utils/validate-user-status";


const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif"];

export default defineEventHandler(async (event) => {
	const formData = await readFormData(event);
	const file = formData.get("image") as File | null;
	const isPro = await validateUserStatus(event.context.user.id) // check if user is a pro
	if (!file) {
		throw createError({
			statusCode: 400,
			statusMessage: "Image is required",
		});
	}

	if (!ACCEPTED_TYPES.includes(file.type)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Please upload a JPG, PNG, or GIF image",
		});
	}

	if (file.size > MAX_FILE_SIZE) {
		throw createError({
			statusCode: 400,
			statusMessage: "Please upload an image under 2MB",
		});
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	await connectCloudinary();

	const uploadFromBuffer = (): Promise<UploadApiResponse> => {
		return new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{
					folder: "bg-removed",
					resource_type: "image",
				},
				(error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
					if (error || !result) {
						return reject(error || new Error("Unknown error occurred during upload"));
					}

					resolve(result);
				}
			);

			uploadStream.end(buffer);
		});
	};

	try {
		const result = await uploadFromBuffer();
		const backgroundRemovedUrl = cloudinary.url(result.public_id, {
			secure: true,
			format: "png",
			resource_type: "image",
			transformation: [
				{
					effect: "background_removal",
					flags: "preserve_transparency",
				},
			],
		});
		if (!isPro) {
			await incrementApiLimit(event.context.user.id)
		}
		return {
			publicId: result.public_id,
			originalUrl: result.secure_url,
			secureUrl: backgroundRemovedUrl,
		};
	} catch (error: any) {
		const message = error?.message || "Cloudinary upload failed";

		console.error("Cloudinary background removal upload failed", {
			message,
			httpCode: error?.http_code,
		});

		throw createError({
			statusCode: error?.http_code || 500,
			statusMessage: message,
		});
	}
});
