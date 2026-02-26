<!-- pages/admin/events/create.vue -->
<script setup lang="ts">
import type { EventFormModel } from '~/types/form'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const router = useRouter()
const authApi = useAuthApi()
const errorMsg = ref<string | null>(null)
const loading = ref(false)

const handleCreate = async (payload: EventFormModel) => {
  errorMsg.value = null
  loading.value = true

  const body: any = {
    title: payload.title,
    description: payload.description || null,
    location: payload.location,
  }

  if (payload.status) body.status = payload.status
  if (payload.image_path) body.image_path = payload.image_path

  try {
    const created = await authApi<any>('/events', {
      method: 'POST',
      body,
    })
    if (created?.id) {
      router.push(`/admin/events/${created.id}`)
    }
  } catch (err: any) {
    console.error('Error al crear evento', err)
    const status = err?.response?.status || err?.statusCode
    if (status === 403) {
      errorMsg.value = 'No autorizado. Verifica que tu sesion siga activa.'
    } else if (status === 422) {
      errorMsg.value = 'Datos invalidos. Revisa los campos del formulario.'
    } else {
      errorMsg.value = `Error al crear el evento (${status || 'red'}). Intenta de nuevo.`
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="text-h5 mb-4">Nuevo evento</h1>
    <v-alert
      v-if="errorMsg"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="errorMsg = null"
    >
      {{ errorMsg }}
    </v-alert>
    <EventForm
      submit-label="Crear evento"
      :loading="loading"
      @submit="handleCreate"
    />
  </div>
</template>
