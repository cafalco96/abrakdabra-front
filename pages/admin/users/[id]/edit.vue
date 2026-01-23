<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

type UserRole = 'admin' | 'gestor' | 'buyer'

type AdminUser = {
  id: number
  name: string
  email: string
  role: UserRole
  is_active: boolean
}

const route = useRoute()
const router = useRouter()
const { user: currentUser, fetchMe } = useAuth()
const id = route.params.id as string

const {
  data: userData,
  pending,
  error,
} = await useAuthApiFetch<AdminUser>(`/users/${id}`)

const user = computed(() => userData.value ?? null)

const handleSubmit = async (payload: any) => {
  const body: any = {
    name: payload.name,
    email: payload.email,
    role: payload.role,
    is_active: payload.is_active,
  }

  if (payload.password) {
    body.password = payload.password
    body.password_confirmation = payload.password_confirmation
  }

  const { error: updateError } = await useAuthApiFetch(`/users/${id}`, {
    method: 'PUT',
    body,
  })

  if (!updateError.value) {
    // Si el usuario editado es el mismo que está logueado, actualizar su información
    if (currentUser.value && currentUser.value.id === parseInt(id)) {
      await fetchMe()
    }
    router.push('/admin/users')
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Editar usuario</h1>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudo cargar el usuario.
      </v-alert>
    </div>

    <UserForm
      v-else-if="user"
      :model-value="user"
      :is-edit="true"
      submit-label="Guardar usuario"
      @submit="handleSubmit"
    />

    <div v-else class="text-medium-emphasis">
      Usuario no encontrado.
    </div>
  </div>
</template>
