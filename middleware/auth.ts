export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchMe } = useAuth()

  // Si no hay user cargado pero sí token, intenta recuperarlo
  if (!isAuthenticated.value) {
    await fetchMe()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})
