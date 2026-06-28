import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "~~/server/utils/prisma";
import { H3Event } from "h3";
import { setupPolar } from "~~/server/services/polar";

const {
	betterAuthSecret,
	betterAuthUrl,
	githubClientId,
	githubClientSecret,
	googleClientId,
	googleClientSecret,
} = useRuntimeConfig();

export const auth = betterAuth({
	baseURL: betterAuthUrl,
	secret: betterAuthSecret,
	database: prismaAdapter(prisma, {
		provider: "sqlite",
	}),
	emailAndPassword: {
		enabled: true,
	},
	socialProviders: {
		github: {
			clientId: githubClientId,
			clientSecret: githubClientSecret,
		},
		google: { 
            clientId: googleClientId, 
            clientSecret: googleClientSecret, 
        }, 
	},
	account: {
		accountLinking: {
			enabled: true,
		},
	},
	session: {
		cookieCache:{
		enable: true,
		maxAge: 60 * 60 * 24 * 30, // 30 days
		} 
	},
	plugins: [
		setupPolar()
	]
});

export const getAuthSession = async (event: H3Event) => {
	const headers = await event.headers;
	const session = await auth.api.getSession({
		headers
	});

	return session;
};

export const requireAuth = async (event: H3Event) => {
	const session = await getAuthSession(event);
	if (!session) {
	throw createError({
		statusCode: 401,
		statusMessage: "Unauthorized",
	});
	}

	event.context.user = session.user;
}
