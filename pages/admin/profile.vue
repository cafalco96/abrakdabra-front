<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import type { UserRole, MeUser } from '~/types/user'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const router = useRouter()
const { user: currentUser, fetchMe } = useAuth()

// obtener datos actuales del usuario
const { data, pending, error } = await useAuthApiFetch<MeUser>('/me')
const me = computed(() => data.value ?? null)

// formulario local
const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

watch(
  me,
  (val) => {
    if (!val) return
    form.name = val.name
    form.email = val.email
  },
  { immediate: true },
)

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)
const emailChanged = ref(false)

const MIN_PASSWORD_LENGTH = 8
const isValidEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)

const handleSubmit = async () => {
  if (!me.value) return
  errorMessage.value = null
  successMessage.value = null

  const trimmedName = form.name.trim()
  const trimmedEmail = form.email.trim()

  if (!trimmedName) {
    errorMessage.value = 'El nombre es obligatorio.'
    return
  }
  if (!trimmedEmail) {
    errorMessage.value = 'El email es obligatorio.'
    return
  }

  if (!isValidEmail(trimmedEmail)) {
    errorMessage.value = 'Ingresa un correo electrónico válido.'
    return
  }

  const password = form.password.trim()
  const passwordConfirmation = form.password_confirmation.trim()
  const hasPasswordInput = Boolean(password.length || passwordConfirmation.length)

  if (hasPasswordInput) {
    if (password.length < MIN_PASSWORD_LENGTH || passwordConfirmation.length < MIN_PASSWORD_LENGTH) {
      errorMessage.value = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
      return
    }

    if (password !== passwordConfirmation) {
      errorMessage.value = 'Las contraseñas no coinciden.'
      return
    }
  }

  loading.value = true

  try {
    const body: any = {
      name: trimmedName,
      email: trimmedEmail,
    }

    if (hasPasswordInput) {
      body.password = password
      body.password_confirmation = passwordConfirmation
    }

    const { error: updateError } = await useAuthApiFetch(
      `/users/${me.value.id}`,
      {
        method: 'PUT',
        body,
      },
    )

    if (updateError.value) {
      errorMessage.value = 'No se pudo actualizar el perfil.'
      return
    }

    // Detectar si el email cambió
    emailChanged.value = trimmedEmail !== me.value.email

    // Actualizar el usuario localmente de inmediato para que se vea en MainNav
    if (currentUser.value) {
      currentUser.value.name = trimmedName
      currentUser.value.email = trimmedEmail
    }

    // Recargar datos del servidor
    await fetchMe()

    successMessage.value = 'Perfil actualizado correctamente.'
    // Limpiar campos de contraseña después de actualizar
    form.password = ''
    form.password_confirmation = ''

    // Redirigir después de 3 segundos
    setTimeout(() => {
      router.back()
    }, 3000)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Mi perfil</h1>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudo cargar tu perfil.
      </v-alert>
    </div>

    <div v-else-if="me">
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
        <span v-if="emailChanged" class="d-block mt-2">
          📧 Se ha enviado un email de confirmación de autenticación al nuevo correo...
        </span>
      </v-alert>

      <v-card>
        <v-card-text>
          <form @submit.prevent="handleSubmit">
            <v-text-field
              v-model="form.name"
              label="Nombre"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              required
            />

            <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              required
            />

            <v-text-field
              :model-value="me.role"
              label="Rol"
              variant="outlined"
              density="comfortable"
              class="mb-3"
              disabled
            />

            <v-divider class="my-4" />

            <div class="text-subtitle-2 mb-3">
              Cambiar contraseña (opcional)
            </div>

            <v-text-field
              v-model="form.password"
              label="Nueva contraseña (opcional)"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />

            <v-text-field
              v-model="form.password_confirmation"
              label="Confirmar nueva contraseña (opcional)"
              :type="showPasswordConfirmation ? 'text' : 'password'"
              :append-inner-icon="showPasswordConfirmation ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
              variant="outlined"
              density="comfortable"
              class="mb-3"
            />

            <v-btn
              type="submit"
              color="primary"
              :loading="loading"
            >
              Guardar cambios
            </v-btn>
          </form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
