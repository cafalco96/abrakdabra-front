<script setup lang="ts">
import { getEventStatusMeta } from '~/utils/eventStatus'
import SearchBar from '~/components/SearchBar.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

type EventStatus = 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished'

type Creator = {
  id: number
  name: string
  email: string
}

type AdminEventItem = {
  id: number
  title: string
  location: string
  status: EventStatus
  created_at: string
  creator: Creator
}

type EventsPaginated = {
  data: AdminEventItem[]
  total: number
}

type DashboardStats = {
  total_events: number
  events_on_sale: number
  tickets_sold_today: number
  revenue_today: number
  tickets_sold_total: number
  revenue_total: number
}

// Fetch dashboard stats
const { data: statsData } = await useAuthApiFetch<DashboardStats>('/admin/dashboard')

const { data, pending, error } = await useAuthApiFetch<EventsPaginated>('/events')

const events = computed(() => data.value?.data ?? [])

const searchTerm = ref('')

const filteredEvents = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return events.value
  return events.value.filter((event) => {
    const haystack = [event.title, event.location]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(term)
  })
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

const stats = computed(() => [
  { 
    label: 'Eventos totales', 
    value: statsData.value?.total_events ?? 0, 
    icon: 'mdi-calendar-multiple' 
  },
  { 
    label: 'Eventos en venta', 
    value: statsData.value?.events_on_sale ?? 0, 
    icon: 'mdi-calendar-star' 
  },
  { 
    label: 'Entradas vendidas (hoy)', 
    value: statsData.value?.tickets_sold_today ?? 0, 
    icon: 'mdi-ticket-confirmation' 
  },
  { 
    label: 'Ingresos hoy', 
    value: formatCurrency(statsData.value?.revenue_today ?? 0), 
    icon: 'mdi-currency-usd' 
  },
  { 
    label: 'Entradas vendidas (total)', 
    value: statsData.value?.tickets_sold_total ?? 0, 
    icon: 'mdi-ticket-confirmation-outline' 
  },
  { 
    label: 'Ingresos totales', 
    value: formatCurrency(statsData.value?.revenue_total ?? 0), 
    icon: 'mdi-cash-multiple' 
  },
])
</script>

<template>
  <div>
    <h1 class="text-h5 mb-6">
      Resumen del panel
    </h1>

    <div v-if="pending">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudo cargar la información del panel.
      </v-alert>
    </div>

    <div v-else>
      <!-- KPIs -->
      <v-row class="mb-6" dense>
        <v-col
          v-for="item in stats"
          :key="item.label"
          cols="12"
          sm="6"
          md="4"
          lg="2"
        >
          <v-card class="h-100">
            <v-card-text class="d-flex flex-column align-center justify-center text-center pa-4" style="min-height: 120px;">
              <v-icon :icon="item.icon" size="32" color="primary" class="mb-2" />
              <div class="text-caption text-medium-emphasis text-uppercase mb-1" style="font-size: 0.65rem; line-height: 1.2;">
                {{ item.label }}
              </div>
              <div class="text-h5 font-weight-bold">
                {{ item.value }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Lista de eventos recientes -->
      <v-card>
        <v-card-title>
          Eventos recientes
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <SearchBar
              v-model="searchTerm"
              placeholder="Buscar eventos..."
              @search="(val) => (searchTerm = val)"
            />
          </div>
          <v-table v-if="filteredEvents.length" density="comfortable">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Estado</th>
                <th>Creado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="event in filteredEvents.slice(0, 5)"
                :key="event.id"
              >
                <td>{{ event.title }}</td>
                <td>{{ event.location }}</td>
                <td>{{ getEventStatusMeta(event.status).label }}</td>
                <td>{{ new Date(event.created_at).toLocaleDateString() }}</td>
                <td class="text-right">
                  <v-btn
                    size="x-small"
                    variant="text"
                    :to="`/admin/events/${event.id}`"
                  >
                    Ver
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <div v-else class="text-body-2 text-medium-emphasis">
            Aún no tienes eventos creados.
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>
