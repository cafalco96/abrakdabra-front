<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
})

import { useAuthApiFetch } from '~/composables/useAuthApiFetch'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = ref({ email: '' })
const loading = ref(false)
const message = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const errors = ref<Record<string, string[]>>({})

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'Debe ser un correo electrónico válido',
]

const validateForm = () => {
  errors.value = {}
  const emailError = emailRules.map(rule => rule(form.value.email)).find(r => r !== true)
  if (emailError && emailError !== true) {
    errors.value.email = [emailError as string]
    return false
  }
  return true
}

const handleSubmit = async () => {
  message.value = null
  errorMessage.value = null
  if (!validateForm()) {
    errorMessage.value = 'Corrige el correo e inténtalo de nuevo.'
    return
  }

  loading.value = true

  const { error, data } = await useAuthApiFetch<{ message: string }>('/forgot-password', {
    method: 'POST',
    body: form.value,
  })

  loading.value = false

  if (error.value) {
    const err: any = error.value
    if (err.status === 422 && err.data?.errors) {
      errors.value = err.data.errors
      errorMessage.value = err.data?.message || 'Revisa el correo e inténtalo de nuevo.'
    } else {
      errorMessage.value = err.data?.message || 'No se pudo enviar el correo de recuperación.'
    }
    return
  }

  const backendMessage = data.value?.message as string | undefined

  // Algunos backends responden 200 con mensaje "We can't find a user..."; mostrarlo como error
  if (backendMessage && /can't find a user/i.test(backendMessage)) {
    errorMessage.value = 'No encontramos una cuenta con ese correo.'
    return
  }

  message.value = 'Te enviaremos un enlace de recuperación con las instrucciones en unos minutos. Revisa tu bandeja de entrada y spam.'
}
</script>

<template>
  <v-container class="py-10" max-width="480">
    <h1 class="text-h5 mb-4">
      Recuperar contraseña
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

      <v-btn
        color="primary"
        class="mt-4"
        block
        :loading="loading"
        type="submit"
      >
        Enviar enlace
      </v-btn>

      <v-btn
        class="mt-2"
        variant="text"
        block
        @click="router.push('/auth/login')"
      >
        Volver al inicio de sesión
      </v-btn>
    </v-form>
  </v-container>
</template>
