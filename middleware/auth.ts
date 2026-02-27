export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchMe, logout, user } = useAuth()

  // Si no hay user cargado pero sí token, intenta recuperarlo
  if (!isAuthenticated.value) {
    await fetchMe()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }

  // Si el usuario fue desactivado por un admin, forzar logout
  if (user.value && !user.value.is_active) {
    await logout()
    return navigateTo('/auth/login?error=inactive')
  }
})
