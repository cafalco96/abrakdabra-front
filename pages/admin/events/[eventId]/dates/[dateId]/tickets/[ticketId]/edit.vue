<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

type TicketCategory = {
  id: number
  event_date_id: number
  name: string
  price: string
  stock_total: number
  stock_sold: number
  status: string
  created_at: string
  updated_at: string
}

const route = useRoute()
const router = useRouter()

const eventId = route.params.eventId as string
const dateId = route.params.dateId as string
const ticketId = route.params.ticketId as string

const { data: ticketData, pending, error } = await useAuthApiFetch<TicketCategory>(
  `/events/${eventId}/dates/${dateId}/ticket-categories/${ticketId}`
)

const ticket = computed(() => ticketData.value ?? null)

const handleSubmit = async (payload: any) => {
  const body: any = {
    name: payload.name,
    price: payload.price,
    stock_total: payload.stock_total,
  }
  if (payload.status) body.status = payload.status

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
