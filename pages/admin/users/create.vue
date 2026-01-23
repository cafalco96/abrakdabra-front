<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const router = useRouter()

const handleSubmit = async (payload: any) => {
  const body: any = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    password_confirmation: payload.password_confirmation,
    role: payload.role,
    is_active: payload.is_active,
  }

  const { error } = await useAuthApiFetch('/users', {
    method: 'POST',
    body,
  })

  if (!error.value) {
    router.push('/admin/users')
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Nuevo usuario</h1>

    <UserForm
      submit-label="Crear usuario"
      @submit="handleSubmit"
    />
  </div>
</template>
