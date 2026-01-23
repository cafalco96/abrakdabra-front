// middleware/role-admin-gestor.ts
export default defineNuxtRouteMiddleware(async () => {
  const { role, isAuthenticated, fetchMe } = useAuth()

  if (!isAuthenticated.value) {
    await fetchMe()
  }

  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }

  if (role.value !== 'admin' && role.value !== 'gestor') {
    return navigateTo('/') // o a una página 403
  }
})
