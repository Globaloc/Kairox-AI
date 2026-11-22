export default defineNuxtRouteMiddleware(async () => {
	const { loggedIn, fetchSession } = useAuth()
	const localePath = useLocalePath()

	if (!loggedIn.value) {
		await fetchSession()
	}

	if (loggedIn.value) {
		return navigateTo(localePath("/dashboard"))
	}
})
