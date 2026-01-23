<script setup lang="ts">
type UserRole = 'admin' | 'gestor' | 'buyer'

type UserFormModel = {
  name: string
  email: string
  password: string | null
  password_confirmation: string | null
  role: UserRole
  is_active: boolean
}

const props = defineProps<{
  modelValue?: Partial<UserFormModel>
  submitLabel?: string
  isEdit?: boolean
  isBuyer?: boolean
}>()

const emits = defineEmits<{
  (e: 'submit', payload: UserFormModel): void
}>()

const form = reactive<UserFormModel>({
  name: props.modelValue?.name ?? '',
  email: props.modelValue?.email ?? '',
  password: null,
  password_confirmation: null,
  role: (props.modelValue?.role as UserRole) ?? 'buyer',
  is_active: props.modelValue?.is_active ?? true,
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const showPassword = ref(false)
const showPasswordConfirmation = ref(false)

const MIN_PASSWORD_LENGTH = 8

const isValidEmail = (email: string) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)

const handleSubmit = () => {
  errorMessage.value = null

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

  const password = form.password ?? ''
  const passwordConfirmation = form.password_confirmation ?? ''
  const hasPasswordInput = Boolean(password.length || passwordConfirmation.length)

  if (!props.isEdit) {
    if (!password || !passwordConfirmation) {
      errorMessage.value = 'La contraseña y su confirmación son obligatorias.'
      return
    }
  }

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

  // Normalizar valores antes de enviar
  form.name = trimmedName
  form.email = trimmedEmail

  loading.value = true
  try {
    emits('submit', { ...form })
  } finally {
    loading.value = false
  }
}

const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Gestor', value: 'gestor' },
  { label: 'Comprador', value: 'buyer' },
]
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
        v-model="form.password"
        :label="isEdit ? 'Nueva contraseña (opcional)' : 'Contraseña'"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPassword = !showPassword"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        :required="!isEdit"
      />

      <v-text-field
        v-model="form.password_confirmation"
        :label="isEdit ? 'Confirmar nueva contraseña (opcional)' : 'Confirmar contraseña'"
        :type="showPasswordConfirmation ? 'text' : 'password'"
        :append-inner-icon="showPasswordConfirmation ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showPasswordConfirmation = !showPasswordConfirmation"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        :required="!isEdit"
      />

      <v-select
        v-if="!isBuyer"
        v-model="form.role"
        :items="roleOptions"
        item-title="label"
        item-value="value"
        label="Rol"
        variant="outlined"
        density="comfortable"
        class="mb-3"
      />

      <v-switch
        v-if="!isBuyer"
        v-model="form.is_active"
        label="Usuario activo"
        color="primary"
        class="mb-4"
      />

      <v-btn
        type="submit"
        color="primary"
        :loading="loading"
      >
        {{ submitLabel || 'Guardar' }}
      </v-btn>
    </form>
  </div>
</template>
