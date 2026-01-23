export const useAuthApiFetch = <T>(path: string, options: any = {}) => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  return useFetch<T>(path, {
    baseURL: config.public.apiBase,
    headers: {
      ...(options.headers || {}),
      ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
    },
    ...options,
  })
}
