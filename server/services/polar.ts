import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";


const { polarAccessToken, polarServer, polarProductId, polarWebhookSecret } = useRuntimeConfig()

const polarClient = () => {
	return new Polar({
	accessToken: polarAccessToken,
	server: polarServer as "sandbox" | "production",
})};

export const setupPolar = () => polar({
	client: polarClient(),
	createCustomOnSignUp: true,
	use: [
		checkout({
			products: [
				{
					productId: polarProductId,
					slug: "pro-monthly"
				}
			],
			successUrl: "/",
			authenticatedUsersOnly: true
		}),
		portal(),
		usage(),
		webhooks({
			secret: polarWebhookSecret,
		})
	]
});

const polarCall = polarClient();

export const getPolarCustomerState = async (userId: string) => {
	try {
		const customerState = await polarCall.customers.getStateExternal({ externalId: userId });
		return customerState;
	} catch (error) {
		if (error instanceof Error && error.name === "ResourceNotFound") {
			return null;
		}

		throw error;
	}
}

export const getCustomerPortalUrl = async (userId: string) => {
	const customerSession = await polarCall.customerSessions.create({ externalCustomerId: userId });
	return customerSession.customerPortalUrl;
}
