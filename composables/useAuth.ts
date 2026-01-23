// composables/useAuth.ts
type UserRole = 'admin' | 'gestor' | 'buyer'

type AuthUser = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

type LoginResponse = {
  user: AuthUser
  token: string
}

type LoginPayload = {
  email: string
  password: string
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth:user', () => null)
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    path: '/',
  })

  const isAuthenticated = computed(() => !!user.value && !!token.value)
  const role = computed<UserRole | null>(() => user.value?.role ?? null)

  const login = async (payload: LoginPayload) => {
    const config = useRuntimeConfig()

    const { data, error } = await useFetch<LoginResponse>('/login', {
      baseURL: config.public.apiBase,
      method: 'POST',
      body: payload,
    })

    if (error.value) {
      throw error.value
    }

    if (data.value) {
      token.value = data.value.token
      user.value = data.value.user
    }
  }

  const fetchMe = async () => {
    // Para recargar usuario si sólo tenemos token
    const config = useRuntimeConfig()

    if (!token.value) return

    const { data, error } = await useFetch<AuthUser>('/me', {
      baseURL: config.public.apiBase,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!error.value && data.value) {
      user.value = data.value
    }
  }

  const logout = async () => {
    const config = useRuntimeConfig()

    try {
      if (token.value) {
        await useFetch('/logout', {
          baseURL: config.public.apiBase,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        })
      }
    } catch {
      // ignorar errores de logout
    }

    token.value = null
    user.value = null
  }

  return {
    user,
    token,
    role,
    isAuthenticated,
    login,
    fetchMe,
    logout,
  }
}
