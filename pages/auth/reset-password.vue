<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})

import { useRoute, useRouter } from 'vue-router'
import { useAuthApiFetch } from '~/composables/useAuthApiFetch'

const route = useRoute()
const router = useRouter()

const form = ref({
  token: (route.query.token as string) || '',
  email: (route.query.email as string) || '',
  password: '',
  password_confirmation: '',
})

const loading = ref(false)
const message = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const errors = ref<Record<string, string[]>>({})

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'Debe ser un correo electrónico válido',
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
]

const validateForm = () => {
  errors.value = {}

  const emailError = emailRules.map(rule => rule(form.value.email)).find(r => r !== true)
  if (emailError && emailError !== true) {
    errors.value.email = [emailError as string]
  }

  const passwordError = passwordRules.map(rule => rule(form.value.password)).find(r => r !== true)
  if (passwordError && passwordError !== true) {
    errors.value.password = [passwordError as string]
  }

  if (form.value.password_confirmation !== form.value.password) {
    errors.value.password_confirmation = ['Las contraseñas no coinciden.']
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  message.value = null
  errorMessage.value = null
  if (!validateForm()) {
    errorMessage.value = 'Corrige los campos e inténtalo de nuevo.'
    return
  }

  loading.value = true

  const { error, data } = await useAuthApiFetch<{ message: string }>('/reset-password', {
    method: 'POST',
    body: form.value,
  })

  loading.value = false

  if (error.value) {
    const err: any = error.value
    if (err.status === 422 && err.data?.errors) {
      errors.value = err.data.errors
      errorMessage.value = err.data?.message || 'Revisa los campos e inténtalo de nuevo.'
    } else {
      errorMessage.value = err.data?.message ?? 'No se pudo restablecer la contraseña.'
    }
    return
  }

  message.value = data.value?.message ?? 'Contraseña restablecida correctamente.'
  // Opcional: redirigir al login después de unos segundos
  setTimeout(() => {
    router.push('/auth/login')
  }, 2000)
}
</script>

<template>
  <v-container class="py-10" max-width="480">
    <h1 class="text-h5 mb-4">
      Restablecer contraseña
    </h1>

    <v-alert
      v-if="message"
      type="success"
      variant="tonal"
      class="mb-4"
    >
      {{ message }}
    </v-alert>

    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ errorMessage }}
    </v-alert>

    <v-form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        :error-messages="errors.email"
        required
      />

      <v-text-field
        v-model="form.password"
        label="Nueva contraseña"
        type="password"
        :error-messages="errors.password"
        required
      />

      <v-text-field
        v-model="form.password_confirmation"
        label="Confirmar contraseña"
        type="password"
        :error-messages="errors.password_confirmation"
        required
      />

      <v-btn
        color="primary"
        class="mt-4"
        block
        :loading="loading"
        type="submit"
      >
        Guardar contraseña
      </v-btn>
    </v-form>
  </v-container>
</template>
