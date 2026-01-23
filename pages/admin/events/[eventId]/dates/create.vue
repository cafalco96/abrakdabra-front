<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const route = useRoute()
const router = useRouter()

const eventId = route.params.eventId as string

const handleSubmit = async (payload: any) => {
  const body: any = {
    starts_at: payload.starts_at,
  }
  if (payload.ends_at) body.ends_at = payload.ends_at
  if (payload.status) body.status = payload.status

  const { data, error } = await useAuthApiFetch(`/events/${eventId}/dates`, {
    method: 'POST',
    body,
  })

  if (!error.value) {
    router.push(`/admin/events/${eventId}`)
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Nueva fecha</h1>

    <EventDateForm
      submit-label="Guardar fecha"
      @submit="handleSubmit"
    />
  </div>
</template>
