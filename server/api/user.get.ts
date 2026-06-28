import { getUserApiLimitCount } from "~~/server/services/user-api-limit";
import { getCustomerPortalUrl, getPolarCustomerState } from "~~/server/services/polar";

export default defineAuthenticatedEventHandler(async (event) => {
	const userApiLimitCount = await getUserApiLimitCount(event.context.user.id);
	const customerState = await getPolarCustomerState(event.context.user.id);
	const subscription = customerState?.activeSubscriptions?.[0];
	const customerPortalUrl = subscription
		? await getCustomerPortalUrl(event.context.user.id).catch(() => null)
		: null;

	return {
		userApiLimitCount,
		customerPortalUrl,
		customerState,
		subscription,
	}
})
