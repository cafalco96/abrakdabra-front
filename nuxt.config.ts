import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  alias: {
    '~': fileURLToPath(new URL('./', import.meta.url)),
    '@': fileURLToPath(new URL('./', import.meta.url)),
  },

  modules: ['vuetify-nuxt-module'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'abrakdabraDark',
        themes: {
          abrakdabraDark: {
            dark: true,
            colors: {
              background: '#0b0909',
              surface: '#16161a',
              primary: '#e11d48',
              secondary: '#6366f1',
              info: '#0ea5e9',
              success: '#22c55e',
              warning: '#facc15',
              error: '#f97373',
            },
          },
        },
      },
    },
  },

  css: [
    '@mdi/font/css/materialdesignicons.css',
  ],

  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8000/api', // Laravel api.php
    },
  },

  ssr: false,
  
  router: {
    options: {
      hashMode: false,
    },
  },
})
