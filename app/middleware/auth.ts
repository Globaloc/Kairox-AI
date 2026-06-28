export default defineNuxtRouteMiddleware(async () => {
	const { loggedIn } = useAuth()
	const localePath = useLocalePath()

	if (!loggedIn.value) {
		return navigateTo(localePath("/auth/login"))
	}
})
