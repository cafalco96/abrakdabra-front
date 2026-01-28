<script setup lang="ts">
const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const valid = ref(false)
const acceptTerms = ref(false)

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'Debe ser un correo electrónico válido',
]

const nameRules = [
  (v: string) => !!v || 'El nombre es requerido',
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres',
]

const passwordConfirmationRules = [
  (v: string) => !!v || 'Debes confirmar la contraseña',
  (v: string) => v === form.password || 'Las contraseñas no coinciden',
]

const termsRules = [
  (v: boolean) => !!v || 'Debes aceptar los términos y la política de privacidad',
]

const handleRegister = async () => {
  if (!valid.value) return
  errorMessage.value = null
  successMessage.value = null
  loading.value = true

  try {
    const { data, error } = await useApiFetch<{
      user: any
      token: string
    }>('/register', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      },
    })

    if (error.value) {
      const message = (error.value as any)?.data?.message
      const errors = (error.value as any)?.data?.errors
      
      if (errors) {
        // Si hay errores de validación del backend
        const firstError = Object.values(errors)[0]
        errorMessage.value = Array.isArray(firstError) ? firstError[0] : 'No se pudo completar el registro.'
      } else if (message) {
        errorMessage.value = message
      } else {
        errorMessage.value = 'No se pudo completar el registro.'
      }
      return
    }

    // opcional: guardar token provisional si tu flujo lo requiere
    // await useAuth().setToken(data.value!.token)

    successMessage.value =
      'Registro completado. Revisa tu correo para verificar tu cuenta.'
    form.password = ''
    form.password_confirmation = ''

    // opcional: redirigir a página de "revisa tu correo"
    // router.push('/auth/check-email')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-3"
    >
      {{ errorMessage }}
    </v-alert>

    <v-alert
      v-if="successMessage"
      type="success"
      variant="tonal"
      density="compact"
      class="mb-3"
    >
      {{ successMessage }}
    </v-alert>

    <v-card>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="handleRegister">
          <v-text-field
            v-model="form.name"
            label="Nombre"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :rules="nameRules"
            required
          />

          <v-text-field
            v-model="form.email"
            label="Correo electrónico"
            type="email"
            variant="outlined"
            density="comfortable"
            class="mb-3"
            :rules="emailRules"
            required
          />

          <v-text-field
            v-model="form.password"
            label="Contraseña"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            :rules="passwordRules"
            required
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
          />

          <v-text-field
            v-model="form.password_confirmation"
            label="Confirmar contraseña"
            :type="showPasswordConfirmation ? 'text' : 'password'"
            variant="outlined"
            density="comfortable"
            class="mb-4"
            :rules="passwordConfirmationRules"
            required
            :append-inner-icon="showPasswordConfirmation ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
          />

          <v-checkbox
            v-model="acceptTerms"
            :rules="termsRules"
            required
            density="comfortable"
            class="mb-2"
          >
            <template #label>
              <span class="text-body-2">
                He leído y acepto los
                <NuxtLink to="/terms" target="_blank" class="text-primary">Términos y condiciones</NuxtLink>
                y la
                <NuxtLink to="/privacy" target="_blank" class="text-primary">Política de privacidad</NuxtLink>
              </span>
            </template>
          </v-checkbox>

          <v-btn
            type="submit"
            color="primary"
            block
            :loading="loading"
            :disabled="!valid || !acceptTerms"
          >
            Registrarse
          </v-btn>

          <div class="text-center mt-4">
            <span class="text-body-2">
              ¿Ya tienes cuenta?
              <NuxtLink to="/auth/login">Inicia sesión</NuxtLink>
            </span>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
