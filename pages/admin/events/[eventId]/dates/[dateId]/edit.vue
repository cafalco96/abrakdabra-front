<script setup lang="ts">
import type { EventDate } from '~/types/eventDate'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const route = useRoute()
const eventId = route.params.eventId as string
const dateId = route.params.dateId as string

const { data: dateData, pending, error } = await useAuthApiFetch<EventDate>(
  `/events/${eventId}/dates/${dateId}`
)

const dateItem = computed(() => dateData.value ?? null)

const handleSubmit = async (payload: any) => {
  const body: any = {
    starts_at: payload.starts_at,
  }
  if (payload.ends_at) body.ends_at = payload.ends_at
  if (payload.status) body.status = payload.status

  const { data, error } = await useAuthApiFetch(
    `/events/${eventId}/dates/${dateId}`,
    {
      method: 'PUT',
      body,
    }
  )

  if (!error.value) {
    await navigateTo({
      path: `/admin/events/${eventId}`,
      query: {
        openDateId: String(dateId),
        reloadTickets: '1',
      },
    })
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Editar fecha</h1>
    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudo cargar la fecha.
      </v-alert>
    </div>

    <div v-else-if="dateItem">
      <EventDateForm
        :model-value="dateItem"
        submit-label="Guardar fecha"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
