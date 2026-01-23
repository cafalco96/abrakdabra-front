// middleware/role-admin.ts
export default defineNuxtRouteMiddleware(async () => {
  const { role, isAuthenticated, fetchMe } = useAuth()

  // Si no hay sesión cargada pero existe token, intenta obtener al usuario
  if (!isAuthenticated.value) {
    await fetchMe()
  }

  if (!isAuthenticated.value) {
    return abortNavigation(
      createError({
        statusCode: 401,
        statusMessage: 'Debes iniciar sesión para acceder a esta página.',
      })
    )
  }

  if (role.value !== 'admin') {
    return abortNavigation(
      createError({
        statusCode: 403,
        statusMessage: 'Solo administradores pueden acceder a esta página.',
      })
    )
  }
})
