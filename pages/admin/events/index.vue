<script setup lang="ts">
import { getEventStatusMeta } from '~/utils/eventStatus'
import type { AdminEvent } from '~/types/admin'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

const { data, pending, error } = await useAuthApiFetch<AdminEventsResponse>('/events')

const events = computed(() => data.value?.data?.filter((item) => item && item.id != null) ?? [])

const searchTerm = ref('')

const filteredEvents = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return events.value
  return events.value.filter((event) => {
    const haystack = [event.title, event.location, event.creator?.name]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
})

// Diálogo de confirmación para eliminar evento
const deleteDialog = ref(false)
const eventToDelete = ref<number | null>(null)

const confirmDeleteEvent = (eventId: number) => {
  eventToDelete.value = eventId
  deleteDialog.value = true
}

const deleteEvent = async () => {
  if (!eventToDelete.value) return

  const { error: deleteError } = await useAuthApiFetch(
    `/events/${eventToDelete.value}`,
    { method: 'DELETE' }
  )

  if (!deleteError.value && data.value) {
    // Crear nuevo objeto para forzar reactividad
    data.value = {
      ...data.value,
      data: data.value.data?.filter(e => e.id !== eventToDelete.value) ?? []
    }
  }

  deleteDialog.value = false
  eventToDelete.value = null
}
</script>

<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5">
        Eventos
      </h1>

      <v-btn color="primary" prepend-icon="mdi-plus" to="/admin/events/create">
        Nuevo evento
      </v-btn>
    </div>

    <div class="mb-4">
      <SearchBar
        v-model="searchTerm"
        placeholder="Buscar eventos..."
        @search="(val) => (searchTerm = val)"
      />
    </div>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudieron cargar los eventos.
      </v-alert>
    </div>

    <v-table v-else density="comfortable">
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Título</th>
          <th>Ubicación</th>
          <th>Creador</th>
          <th>Estado</th>
          <th>Fecha creación</th>
          <th class="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in filteredEvents" :key="event.id">
          <td>
            <v-img
              v-if="event.image_path"
              :src="event.image_path"
              height="50"
              width="50"
              cover
              class="rounded"
            />
            <div v-else class="text-caption text-medium-emphasis">-</div>
          </td>
          <td>{{ event.title }}</td>
          <td>{{ event.location }}</td>
          <td>{{ event.creator?.name }}</td>
          <td>
            <span v-if="event.status">{{ getEventStatusMeta(event.status).label }}</span>
            <span v-else class="text-caption text-medium-emphasis">-</span>
          </td>
          <td>{{ event.created_at ? new Date(event.created_at).toLocaleDateString() : '-' }}</td>
          <td class="text-right">
            <v-btn
              icon="mdi-cog"
              variant="text"
              density="comfortable"
              color="primary"
              :to="`/admin/events/${event.id}`"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              density="comfortable"
              color="error"
              @click="confirmDeleteEvent(event.id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Diálogo de confirmación para eliminar evento -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar este evento? Se eliminarán todas sus fechas y tickets asociados. Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteEvent">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
