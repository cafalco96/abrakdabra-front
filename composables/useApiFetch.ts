export const useApiFetch = <T>(path: string, options: any = {}) => {
  const config = useRuntimeConfig()

  return useFetch<T>(path, {
    baseURL: config.public.apiBase,
    ...options,
  })
}