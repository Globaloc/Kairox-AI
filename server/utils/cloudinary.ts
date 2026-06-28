import { v2 as cloudinary } from "cloudinary";

export const connectCloudinary = async () => {
	const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } = useRuntimeConfig();

	if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
		throw createError({
			statusCode: 500,
			statusMessage: "Cloudinary credentials are not configured",
		});
	}

	cloudinary.config({
		cloud_name: cloudinaryCloudName,
		api_key: cloudinaryApiKey,
		api_secret: cloudinaryApiSecret,
	});
};
