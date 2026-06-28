import type { User } from "better-auth";
import { defineEventHandler } from "h3";
import type {
	EventHandler,
	EventHandlerRequest,
	H3Event,
	H3EventContext,
} from "h3";
import { requireAuth } from "~~/server/services/auth";

export type AuthenticatedEvent<
	Request extends EventHandlerRequest = EventHandlerRequest,
> = H3Event<Request> & {
	context: H3EventContext & {
		user: User;
	};
};

export const defineAuthenticatedEventHandler = <
	Request extends EventHandlerRequest = EventHandlerRequest,
	Response = unknown,
>(
	handler: (
		event: AuthenticatedEvent<Request>,
	) => Response | Promise<Response>,
): EventHandler<Request, Response | Promise<Response>> => {
	return defineEventHandler<Request, Response | Promise<Response>>(async (event) => {
		if (!event.context.user) {
			await requireAuth(event);
		}

		return handler(event as AuthenticatedEvent<Request>);
	});
};
