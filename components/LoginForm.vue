<script setup lang="ts">
const props = defineProps<{
  title?: string
  subtitle?: string
}>()

const emits = defineEmits<{
  (e: 'success'): void
}>()

const { login } = useAuth()

const form = reactive({
  email: '',
  password: '',
})

const showPassword = ref(false)

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'Debe ser un correo electrónico válido',
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
]

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const emailVerificationMessage = ref<string | null>(null)
const valid = ref(false)

const handleSubmit = async () => {
  if (!valid.value) return
  
  errorMessage.value = null
  emailVerificationMessage.value = null
  loading.value = true

  try {
    await login({
      email: form.email,
      password: form.password,
    })
    emits('success')
  } catch (err: any) {
    // Nuxt useFetch error format
    const status = err?.status
    const message = err?.data?.message
    
    if (message === 'Debe verificar su correo.') {
      emailVerificationMessage.value = 'Debes verificar tu correo electrónico. Revisa tu bandeja de entrada.'
    } else if (status === 422 || status === 401) {
      errorMessage.value = 'Credenciales inválidas. Revisa tu correo y contraseña.'
    } else {
      errorMessage.value = 'Ocurrió un error al iniciar sesión. Intenta de nuevo.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card max-width="420" class="mx-auto auth-card">
    <v-card-text class="pt-6">
      <div class="mb-4">
        <h1 class="text-h6 mb-1">
          {{ title || 'Inicia sesión' }}
        </h1>
        <p class="text-body-2 text-medium-emphasis mb-0">
          {{ subtitle || 'Accede al panel de administración de Abrakdabra.' }}
        </p>
      </div>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-alert
        v-if="emailVerificationMessage"
        type="warning"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ emailVerificationMessage }}
      </v-alert>

      <v-form v-model="valid" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          variant="outlined"
          density="comfortable"
          autocomplete="email"
          :rules="emailRules"
          required
          class="mb-3"
        />

        <v-text-field
          v-model="form.password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          autocomplete="current-password"
          :rules="passwordRules"
          required
          class="mb-2"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        />

        <div class="text-right mb-4">
          <NuxtLink to="/auth/forgot-password" class="text-caption">
            ¿Olvidaste tu contraseña?
          </NuxtLink>
        </div>

        <v-btn
          type="submit"
          color="primary"
          block
          :loading="loading"
          :disabled="!valid"
        >
          Iniciar sesión
        </v-btn>

        <div class="text-center mt-4">
          <span class="text-body-2">
            ¿No tienes cuenta?
            <NuxtLink to="/auth/register">Regístrate</NuxtLink>
          </span>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.auth-card {
  background: radial-gradient(circle at top left, rgba(239, 68, 68, 0.18), transparent 55%),
    #050507;
  border: 1px solid rgba(148, 27, 52, 0.5);
}
</style>
