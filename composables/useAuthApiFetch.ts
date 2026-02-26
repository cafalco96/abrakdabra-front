export const useAuthApiFetch = <T>(path: string | (() => string), options: any = {}) => {
  const config = useRuntimeConfig()
  const { token } = useAuth()

  return useFetch<T>(path, {
    baseURL: config.public.apiBase,
    onRequest({ options: reqOptions }) {
      const headers = new Headers(reqOptions.headers as HeadersInit | undefined)
      if (token.value) {
        headers.set('Authorization', `Bearer ${token.value}`)
      }
      if (options.headers) {
        const extra = new Headers(options.headers)
        extra.forEach((value, key) => headers.set(key, value))
      }
      reqOptions.headers = headers
    },
    ...options,
  })
}
