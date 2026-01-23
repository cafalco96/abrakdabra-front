<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const route = useRoute()
const router = useRouter()

const eventId = route.params.eventId as string
const dateId = route.params.dateId as string

const handleSubmit = async (payload: any) => {
  const body: any = {
    name: payload.name,
    price: payload.price,
    stock_total: payload.stock_total,
  }
  if (payload.status) body.status = payload.status

  const { data, error } = await useAuthApiFetch(
    `/events/${eventId}/dates/${dateId}/ticket-categories`,
    { method: 'POST', body },
  )

  if (!error.value) {
    router.push(`/admin/events/${eventId}`)
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Nuevo ticket</h1>

    <TicketCategoryForm
      submit-label="Guardar ticket"
      @submit="handleSubmit"
    />
  </div>
</template>
