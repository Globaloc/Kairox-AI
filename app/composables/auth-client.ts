import { createAuthClient } from "better-auth/vue"
import type { InferSessionFromClient, InferUserFromClient } from "better-auth/client"
import type { RouteLocationRaw } from "vue-router"
import { polarClient } from "@polar-sh/better-auth/client";

const getAuthClientOptions = () => ({
	baseURL: useRequestURL().origin,
	fetchOptions: {
		headers: import.meta.server ? useRequestHeaders() : undefined,
	},
	plugins: [
		polarClient(),
	],
});

type ClientOptions = ReturnType<typeof getAuthClientOptions>;

export function useAuth(){
const authClientOptions = getAuthClientOptions();
const authClient = createAuthClient(authClientOptions)

const session = useState<InferSessionFromClient<ClientOptions> | null>("auth:session", () => null);
const user = useState<InferUserFromClient<ClientOptions> | null>("auth:user", () => null);
const sessionFetching = import.meta.server ? ref(false) : useState("auth:sessionFetching", () => false);

const fetchSession = async () => {

	if(sessionFetching.value){
		return
	}
	sessionFetching.value = true

	const { data } = await authClient.getSession({
		fetchOptions: {
			headers: authClientOptions.fetchOptions.headers
			}
	})
	session.value = data?.session || null
	user.value = data?.user || null
	sessionFetching.value = false
	return data
}

if(import.meta.client){
	authClient.$store.listen("$sessionSignal", async (signal) => {
		if(!signal) return
		await fetchSession()
	});
}

const logout = async({redirectTo }: {redirectTo?: RouteLocationRaw} = {}) => {
	await authClient.signOut();
	if(redirectTo){ 
		await navigateTo(redirectTo);
	}
}

const upgradeUserToPro = async() => {
	await authClient.checkout({
		slug: "pro-monthly"
		})
	}

return {
	signIn: authClient.signIn,
	signUp: authClient.signUp,
	logout,
	upgradeUserToPro,
	session,
	user,
	fetchSession,
	loggedIn: computed(() => !!session.value)
}
}
