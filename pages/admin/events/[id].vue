<script setup lang="ts">
import { getEventStatusMeta } from '~/utils/eventStatus'
import { getEventDateStatusMeta } from '~/utils/eventDateStatus'
import type {
  AdminEventDateStatus,
  AdminEventStats,
  AdminEventTicketCategory,
  AdminEventDateItem,
  AdminEventBase,
} from '~/types/api'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

// Type aliases for internal use
type TicketCategory = AdminEventTicketCategory
type EventDate = AdminEventDateItem

const route = useRoute()
const id = route.params.id as string

const {
  data: eventData,
  pending: pendingEvent,
  error: errorEvent,
} = await useAuthApiFetch<AdminEventBase>(() => `/events/${id}`, {
  key: () => `event:${id}:${route.query.reloadKey || ''}`,
})

const event = computed(() => eventData.value ?? null)

const {
  data: datesData,
  pending: pendingDates,
  error: errorDates,
} = await useAuthApiFetch<EventDate[]>(`/events/${id}/dates`)

const dates = computed(() => datesData.value ?? [])

const {
  data: statsData,
  pending: pendingStats,
  error: errorStats,
} = await useAuthApiFetch<AdminEventStats>(`/events/${id}/stats`)

const stats = computed(() => statsData.value ?? { per_category: [], per_day: [] })

const formatMoney = (val: string | number) =>
  Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 })

const formatTicketStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'available': 'Disponible',
    'sold_out': 'Agotado',
    'disabled': 'Deshabilitado',
  }
  return statusMap[status] || status
}

// categorías por fecha
const categoriesByDate = ref<Record<number, TicketCategory[]>>({})
const loadingCategories = ref<Record<number, boolean>>({})
const errorCategories = ref<Record<number, string | null>>({})

// fecha actualmente expandida (modo acordeón)
const expandedDateId = ref<number | null>(null)

// diálogo de confirmación para eliminar fecha
const deleteDialog = ref(false)
const dateToDelete = ref<number | null>(null)

const confirmDeleteDate = (dateId: number) => {
  dateToDelete.value = dateId
  deleteDialog.value = true
}

const deleteDate = async () => {
  if (!dateToDelete.value) return

  const { error } = await useAuthApiFetch(
    `/events/${id}/dates/${dateToDelete.value}`,
    { method: 'DELETE' }
  )

  if (!error.value) {
    // Eliminar de la lista local
    datesData.value = datesData.value?.filter(d => d.id !== dateToDelete.value) || []
    // Limpiar categorías cargadas
    if (dateToDelete.value && categoriesByDate.value[dateToDelete.value]) {
      delete categoriesByDate.value[dateToDelete.value]
    }
    // Cerrar acordeón si estaba abierto
    if (expandedDateId.value === dateToDelete.value) {
      expandedDateId.value = null
    }
  }

  deleteDialog.value = false
  dateToDelete.value = null
}

// diálogo de confirmación para eliminar ticket
const deleteTicketDialog = ref(false)
const ticketToDelete = ref<{ dateId: number; ticketId: number } | null>(null)

// diálogo de confirmación para eliminar evento
const deleteEventDialog = ref(false)

const confirmDeleteEvent = () => {
  deleteEventDialog.value = true
}

const deleteEvent = async () => {
  const { error } = await useAuthApiFetch(`/events/${id}`, { method: 'DELETE' })

  if (!error.value) {
    await navigateTo('/admin/events')
  }

  deleteEventDialog.value = false
}

const confirmDeleteTicket = (dateId: number, ticketId: number) => {
  ticketToDelete.value = { dateId, ticketId }
  deleteTicketDialog.value = true
}

const deleteTicket = async () => {
  if (!ticketToDelete.value) return

  const { dateId, ticketId } = ticketToDelete.value

  const { error } = await useAuthApiFetch(
    `/events/${id}/dates/${dateId}/ticket-categories/${ticketId}`,
    { method: 'DELETE' }
  )

  if (!error.value) {
    // Eliminar de la lista local
    if (categoriesByDate.value[dateId]) {
      categoriesByDate.value[dateId] = categoriesByDate.value[dateId].filter(
        (cat) => cat.id !== ticketId
      )
    }
  }

  deleteTicketDialog.value = false
  ticketToDelete.value = null
}

const toggleDate = async (dateId: number) => {
  if (expandedDateId.value === dateId) {
    expandedDateId.value = null
    return
  }

  expandedDateId.value = dateId

  if (!categoriesByDate.value[dateId]) {
    await loadCategoriesForDate(dateId)
  }
}

const loadCategoriesForDate = async (dateId: number) => {
  loadingCategories.value[dateId] = true
  errorCategories.value[dateId] = null

  const { data, error } = await useAuthApiFetch<TicketCategory[]>(
    `/events/${id}/dates/${dateId}/ticket-categories`
  )

  if (error.value) {
    errorCategories.value[dateId] = 'No se pudieron cargar las categorías de tickets.'
  } else {
    categoriesByDate.value[dateId] = data.value ?? []
  }

  loadingCategories.value[dateId] = false
}

const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''

  const pad = (n: number) => n.toString().padStart(2, '0')

  const yyyy = d.getUTCFullYear()
  const mm = pad(d.getUTCMonth() + 1)
  const dd = pad(d.getUTCDate())
  const hh = pad(d.getUTCHours())
  const mi = pad(d.getUTCMinutes())

  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`
}

onMounted(async () => {
  const openDateId = route.query.openDateId
  const reloadTickets = route.query.reloadTickets
  const parsedId = openDateId ? Number(openDateId) : null

  if (parsedId) {
    expandedDateId.value = parsedId
    if (reloadTickets) {
      await loadCategoriesForDate(parsedId)
    }
  }
})
</script>

<template>
  <div>
    <!-- Encabezado -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center">
        <div>
          <h1 class="text-h5 mb-1 d-flex align-center">
            <span>{{ event?.title || 'Detalle de evento' }}</span>
            <v-btn
              icon="mdi-pencil"
              variant="text"
              density="comfortable"
              class="ml-2"
              :to="`/admin/events/${id}/edit`"
              :disabled="!event"
            />
            <v-btn
              icon="mdi-delete"
              variant="text"
              density="comfortable"
              color="error"
              class="ml-1"
              :disabled="!event"
              @click="confirmDeleteEvent"
            />
          </h1>
          <p class="text-body-2 text-medium-emphasis mb-0">
            {{ event?.location }}
          </p>
        </div>
      </div>

      <v-chip
        v-if="event"
        :color="getEventStatusMeta(event.status).color"
        variant="flat"
        size="small"
      >
        {{ getEventStatusMeta(event.status).label }}
      </v-chip>
    </div>

    <!-- Loading / error -->
    <div v-if="pendingEvent || pendingDates">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="errorEvent || errorDates">
      <v-alert type="error" variant="tonal">
        No se pudo cargar la información del evento.
      </v-alert>
    </div>

    <div v-else>
      <!-- Imagen + Descripción + info creador -->
      <v-row class="mb-6" dense v-if="event">
        <v-col cols="12" md="8">
          <v-card v-if="event.image_path" class="mb-4">
            <v-img
              :src="event.image_path"
              height="300"
              cover
              alt="Portada del evento"
            />
          </v-card>

          <v-card>
            <v-card-title>Descripción</v-card-title>
            <v-card-text class="text-body-2">
              {{ event.description || 'Sin descripción.' }}
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Información</v-card-title>
            <v-card-text class="text-body-2">
              <div class="mb-1">
                <strong>Creador:</strong> {{ event.creator.name }}
              </div>
              <div class="mb-1">
                <strong>Email:</strong> {{ event.creator.email }}
              </div>
              <div class="mb-1">
                <strong>Rol:</strong> {{ event.creator.role }}
              </div>
              <div class="mb-1">
                <strong>Creado:</strong> {{ formatDateTime(event.created_at) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Resumen de ventas -->
      <v-card class="mb-6">
        <v-card-title>
          Resumen de ventas
        </v-card-title>
        <v-card-text>
          <div v-if="pendingStats">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <v-alert
            v-else-if="errorStats"
            type="error"
            variant="tonal"
            density="compact"
            class="mb-2"
          >
            No se pudieron cargar las estadísticas de ventas.
          </v-alert>

          <div v-else>
            <!-- Ventas por categoría -->
            <h3 class="text-subtitle-1 mb-2">
              Entradas por localidad
            </h3>
            <div v-if="stats.per_category.length" class="mb-4">
              <EventCategoryChart :items="stats.per_category" />
            </div>
            <div v-else class="text-caption text-medium-emphasis mb-4">
              Aún no hay ventas registradas para este evento.
            </div>

            <!-- Evolución por día -->
            <h3 class="text-subtitle-1 mb-2">
              Evolución diaria de ventas
            </h3>
            <div v-if="stats.per_day.length">
              <EventSalesPerDayChart :items="stats.per_day" />
            </div>
            <div v-else class="text-caption text-medium-emphasis">
              Aún no hay ventas registradas para este evento.
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Fechas y tickets con tarjetas expandibles -->
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Fechas y tickets</span>

          <v-btn
            size="small"
            color="primary"
            @click="$router.push(`/admin/events/${id}/dates/create`)"
          >
            Añadir fecha
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col
              v-for="date in dates"
              :key="date.id"
              cols="12"
            >
              <v-card class="mb-3">
                <v-card-title
                  class="d-flex align-center justify-space-between"
                  @click="toggleDate(date.id)"
                  style="cursor: pointer;"
                >
                  <div class="d-flex flex-column">
                    <span>{{ formatDateTime(date.starts_at) }}</span>
                    <span class="text-caption text-medium-emphasis">
                      Estado: {{ getEventDateStatusMeta(date.status).label }}
                    </span>
                  </div>

                  <div class="d-flex align-center">
                    <v-btn
                      icon="mdi-pencil"
                      variant="text"
                      density="comfortable"
                      @click.stop="$router.push(`/admin/events/${id}/dates/${date.id}/edit`)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      variant="text"
                      density="comfortable"
                      color="error"
                      @click.stop="confirmDeleteDate(date.id)"
                    />
                    <v-icon>
                      {{
                        expandedDateId === date.id
                          ? 'mdi-chevron-up'
                          : 'mdi-chevron-down'
                      }}
                    </v-icon>
                  </div>
                </v-card-title>

                <v-expand-transition>
                  <div v-show="expandedDateId === date.id">
                    <v-divider />

                    <v-card-text>
                      <div v-if="loadingCategories[date.id]">
                        <v-progress-circular indeterminate color="primary" />
                      </div>

                      <v-alert
                        v-else-if="errorCategories[date.id]"
                        type="error"
                        variant="tonal"
                        density="compact"
                        class="mb-2"
                      >
                        {{ errorCategories[date.id] }}
                      </v-alert>

                      <v-table v-else density="comfortable">
                        <thead>
                          <tr>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock total</th>
                            <th>Vendidas</th>
                            <th>Estado</th>
                            <th class="text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="cat in (categoriesByDate[date.id] || [])"
                            :key="cat.id"
                          >
                            <td>{{ cat.name }}</td>
                            <td>${{ cat.price }}</td>
                            <td>{{ cat.stock_total }}</td>
                            <td>{{ cat.stock_sold }}</td>
                            <td>{{ formatTicketStatus(cat.status) }}</td>
                            <td class="text-right">
                              <v-btn
                                icon="mdi-pencil"
                                variant="text"
                                density="comfortable"
                                color="primary"
                                @click="$router.push(`/admin/events/${id}/dates/${date.id}/tickets/${cat.id}/edit`)"
                              />
                              <v-btn
                                icon="mdi-delete"
                                variant="text"
                                density="comfortable"
                                color="error"
                                @click="confirmDeleteTicket(date.id, cat.id)"
                              />
                            </td>
                          </tr>

                          <tr
                            v-if="
                              !categoriesByDate[date.id] ||
                              !categoriesByDate[date.id].length
                            "
                          >
                            <td colspan="6" class="text-caption text-medium-emphasis">
                              No hay categorías de tickets para esta fecha.
                            </td>
                          </tr>
                        </tbody>
                      </v-table>

                      <v-btn
                        size="small"
                        color="primary"
                        @click="$router.push(`/admin/events/${id}/dates/${date.id}/tickets/create`)"
                      >
                        Añadir  ticket
                      </v-btn>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Diálogo de confirmación para eliminar fecha -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar esta fecha? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteDate">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar ticket -->
    <v-dialog v-model="deleteTicketDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar esta categoría de ticket? Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteTicketDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteTicket">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación para eliminar evento -->
    <v-dialog v-model="deleteEventDialog" max-width="420">
      <v-card>
        <v-card-title>Eliminar evento</v-card-title>
        <v-card-text>
          Se eliminará el evento y todas sus fechas y tickets asociados. Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteEventDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteEvent">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
