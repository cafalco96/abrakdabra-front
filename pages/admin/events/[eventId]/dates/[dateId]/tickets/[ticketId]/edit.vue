<script setup lang="ts">
import type { TicketCategory } from '~/types/eventDate'
import type { TicketCategoryFormModel } from '~/types/form'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const route = useRoute()
const router = useRouter()

const eventId = route.params.eventId as string
const dateId = route.params.dateId as string
const ticketId = route.params.ticketId as string

const { data: ticketData, pending, error } = await useAuthApiFetch<TicketCategory>(
  `/events/${eventId}/dates/${dateId}/ticket-categories/${ticketId}`
)

const ticket = computed(() => ticketData.value ?? null)

const handleSubmit = async (payload: TicketCategoryFormModel) => {
  const body = {
    name: payload.name,
    price: payload.price,
    stock_total: payload.stock_total,
    status: payload.status,
  }

  const { data, error } = await useAuthApiFetch(
    `/events/${eventId}/dates/${dateId}/ticket-categories/${ticketId}`,
    { method: 'PUT', body },
  )

  if (!error.value) {
    router.push(`/admin/events/${eventId}`)
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Editar ticket</h1>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudo cargar la categoría de ticket.
      </v-alert>
    </div>

    <div v-else-if="ticket">
      <TicketCategoryForm
        :model-value="ticket"
        submit-label="Guardar ticket"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
