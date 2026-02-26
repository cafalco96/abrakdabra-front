<!-- pages/admin/events/create.vue -->
<script setup lang="ts">
import type { EventFormModel } from '~/types/form'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const router = useRouter()
const authApi = useAuthApi()

const handleCreate = async (payload: EventFormModel) => {
  const body: any = {
    title: payload.title,
    description: payload.description || null,
    location: payload.location,
  }

  // status es opcional según el controlador
  if (payload.status) {
    body.status = payload.status
  }

  // image_path es opcional
  if (payload.image_path) {
    body.image_path = payload.image_path
  }

  try {
    const created = await authApi<any>('/events', {
      method: 'POST',
      body,
    })
    if (created?.id) {
      router.push(`/admin/events/${created.id}`)
    }
  } catch (err) {
    console.error('Error al crear evento', err)
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Nuevo evento</h1>
    <EventForm
      submit-label="Crear evento"
      @submit="handleCreate"
    />
  </div>
</template>
