<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const router = useRouter()
const route = useRoute()
const eventId = route.params.eventId as string

type EventStatus = 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished'

type EventFormModel = {
  title: string
  description: string | null
  location: string
  status: EventStatus | null
  image_path?: string | null
}

const {
  data: eventData,
  pending,
  error,
} = await useAuthApiFetch<EventFormModel & { id: number }>(`/events/${eventId}`)

const event = computed(() => eventData.value ?? null)

const handleUpdate = async (payload: EventFormModel) => {
  const body: any = {
    title: payload.title,
    description: payload.description || null,
    location: payload.location,
  }

  if (payload.status) {
    body.status = payload.status
  }

  if (payload.image_path) {
    body.image_path = payload.image_path
  }

  const { error: updateError } = await useAuthApiFetch(`/events/${eventId}`, {
    method: 'PUT',
    body,
  })

  if (updateError.value) {
    console.error('Error al actualizar evento', updateError.value)
    return
  }

  await router.push({
    path: `/admin/events/${eventId}`,
    query: { reloadKey: Date.now().toString() },
  })
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Editar evento</h1>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudo cargar el evento.
      </v-alert>
    </div>

    <EventForm
      v-else-if="event"
      submit-label="Guardar evento"
      :model-value="event"
      @submit="handleUpdate"
    />

    <div v-else class="text-medium-emphasis">Evento no encontrado.</div>
  </div>
</template>
