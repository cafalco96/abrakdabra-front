<!-- pages/admin/events/create.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const router = useRouter()

type EventStatus = 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished'

type EventFormModel = {
  title: string
  description: string | null
  location: string
  status: EventStatus | null
  image_path?: string | null
}

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

  const { data, error } = await useAuthApiFetch(`/events`, {
    method: 'POST',
    body,
  })

  if (error.value) {
    // aquí luego puedes mapear errores 422 al formulario
    console.error('Error al crear evento', error.value)
    return
  }

  const created = data.value as any
  if (created?.id) {
    router.push(`/admin/events/${created.id}`)
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
