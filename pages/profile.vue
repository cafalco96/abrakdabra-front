<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useAuthApiFetch } from '~/composables/useAuthApiFetch'

type UserRole = 'admin' | 'gestor' | 'buyer'

type BuyerUser = {
  id: number
  name: string
  email: string
  role: UserRole
  is_active: boolean
}

type UserFormPayload = {
  name: string
  email: string
  password?: string
  password_confirmation?: string
}

definePageMeta({
  middleware: ['auth'],
})

const { user: currentUser, fetchMe } = useAuth()

const showSuccessMessage = ref(false)
const emailChanged = ref(false)
const router = useRouter()

const {
  data: userData,
  pending,
  error,
} = await useAuthApiFetch<BuyerUser>('/me')

const user = computed<BuyerUser | null>(() => {
  if (currentUser.value) {
    const u = currentUser.value
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      is_active: u.is_active,
    }
  }
  return userData.value ?? null
})

const handleSubmit = async (payload: UserFormPayload) => {
  const body: any = {
    name: payload.name,
    email: payload.email,
  }

  // Detectar si el email cambió
  const emailWasChanged = user.value && payload.email !== user.value.email
  emailChanged.value = emailWasChanged || false

  if (payload.password) {
    body.password = payload.password
    body.password_confirmation = payload.password_confirmation
  }

  const { error: updateError } = await useAuthApiFetch('/me', {
    method: 'PUT',
    body,
  })

  if (!updateError.value) {
    // Actualizar el estado del usuario localmente de inmediato
    const { user: authUser } = useAuth()
    if (authUser.value) {
      authUser.value.name = payload.name
      authUser.value.email = payload.email
    }
    
    await fetchMe()
    showSuccessMessage.value = true
    
    // Redirigir al home después de 3 segundos
    setTimeout(() => {
      router.push('/')
    }, 3000)
  }
}

const isDeactivating = ref(false)
const deactivateError = ref<string | null>(null)

const handleDeactivate = async () => {
  if (!user.value) return

  const confirmed = window.confirm(
    '¿Seguro que deseas desactivar tu cuenta? No podrás iniciar sesión hasta que un administrador la reactive.'
  )
  if (!confirmed) return

  isDeactivating.value = true
  deactivateError.value = null

  const { error: apiError } = await useAuthApiFetch('/me/deactivate', {
    method: 'POST',
  })

  if (apiError.value) {
    deactivateError.value =
      (apiError.value.data as any)?.message ||
      'No se pudo desactivar la cuenta.'
    isDeactivating.value = false
    return
  }

  // Cerrar sesión localmente
  const { logout } = useAuth()
  await logout?.()

  // Redirigir al login
  router.push('/auth/login')
}
</script>

<template>
  <v-container class="py-10" max-width="600">
    <h1 class="text-h5 mb-4">
      Editar perfil
    </h1>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-alert
      v-if="showSuccessMessage"
      type="success"
      variant="tonal"
      class="mb-4"
    >
      <div class="mb-2">
        ¡Perfil actualizado correctamente! Redirigiendo al inicio...
      </div>
      <div v-if="emailChanged" class="text-caption">
        Se ha enviado un email de confirmación de autenticación al nuevo correo. Por favor, verifica tu bandeja de entrada.
      </div>
    </v-alert>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudo cargar tu perfil.
      </v-alert>
    </div>

    <UserForm
      v-else-if="user"
      :model-value="user"
      :is-edit="true"
      :is-buyer="true"
      submit-label="Guardar perfil"
      @submit="handleSubmit"
    />

    <div v-else class="text-medium-emphasis">
      No se pudo obtener tu información.
    </div>

    <v-alert
      v-if="deactivateError"
      type="error"
      variant="tonal"
      class="mt-4"
    >
      {{ deactivateError }}
    </v-alert>

    <div
      v-if="user"
      class="mt-8"
    >
      <v-divider class="mb-4" />

      <div class="text-subtitle-2 mb-2">
        Desactivar cuenta
      </div>
      <div class="text-caption text-medium-emphasis mb-3">
        Si desactivas tu cuenta, no podrás iniciar sesión hasta que un administrador la reactive.
        Tus órdenes y tickets existentes seguirán siendo válidos.
      </div>

      <v-btn
        color="error"
        variant="outlined"
        :loading="isDeactivating"
        @click="handleDeactivate"
      >
        Desactivar cuenta y cerrar sesión
      </v-btn>
    </div>
  </v-container>
</template>
