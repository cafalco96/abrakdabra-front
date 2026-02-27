<script setup lang="ts">
import { useAuthApiFetch } from '~/composables/useAuthApiFetch'
import type { PaginatedBuyerOrders } from '~/types/api'

const router = useRouter()
const { user } = useAuth()
const page = ref(1)

// Redirigir admin al panel de ordenes administrativas
onMounted(() => {
  if (user.value?.role === 'admin') {
    router.replace('/admin/orders')
  }
})

// fetch paginado
const { data, pending, error, refresh } = await useAuthApiFetch<PaginatedBuyerOrders>('/orders', {
  query: computed(() => ({
    page: page.value,
  })),
})

const orders = computed(() => data.value?.data ?? [])
const paginator = computed(() => data.value)

const formatDateTime = (iso: string | null | undefined) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const formatStatus = (status: OrderStatus) => {
  switch (status) {
    case 'pending_payment':
      return 'Pendiente de pago'
    case 'paid':
      return 'Pagada'
    case 'cancelled':
      return 'Cancelada'
    default:
      return status
  }
}

const statusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending_payment':
      return 'warning'
    case 'paid':
      return 'success'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

// Filtros
const eventNameFilter = ref('')
const statusFilter = ref<string[]>([])
const statusOptions = [
  { label: 'Pendiente de pago', value: 'pending_payment' },
  { label: 'Pagada', value: 'paid' },
  { label: 'Cancelada', value: 'cancelled' },
]

const filteredOrders = computed(() => {
  let result = orders.value
  // Filtrar por nombre del evento
  const eventTerm = eventNameFilter.value.toLowerCase().trim()
  if (eventTerm) {
    result = result.filter(order =>
      order.items.some(item =>
        (item.ticket_category?.event_date?.event?.title ?? '').toLowerCase().includes(eventTerm)
      )
    )
  }
  // Filtrar por estado
  if (statusFilter.value.length > 0) {
    result = result.filter(order => statusFilter.value.includes(order.status))
  }
  return result
})

const goToOrder = (order: Order) => {
  router.push(`/orders/${order.id}`)
}

const changePage = async (newPage: number) => {
  if (!paginator.value) return
  if (newPage < 1 || newPage > paginator.value.last_page) return
  page.value = newPage
  await refresh()
}
</script>

<template>
  <v-container class="py-8" max-width="900">
    <h1 class="text-h4 mb-4">
      Mis ordenes
    </h1>

    <div v-if="pending" class="d-flex justify-center my-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudieron cargar tus ordenes.
      </v-alert>
    </div>

    <div v-else-if="!orders.length">
      <v-alert type="info" variant="tonal">
        Aun no tienes ordenes registradas.
      </v-alert>
    </div>

    <div v-else>
      <div class="mb-4 d-flex flex-column flex-md-row ga-4">
        <SearchBar
          v-model="eventNameFilter"
          placeholder="Buscar por evento..."
          @search="(val) => (eventNameFilter = val)"
        />
        <SearchTags
          v-model="statusFilter"
          :options="statusOptions"
          label="Filtrar por estado"
        />
      </div>

      <v-card variant="flat" class="mb-4">
        <v-table density="comfortable">
          <thead>
            <tr>
              <th class="text-left">
                Orden
              </th>
              <th class="text-left">
                Evento / Fecha
              </th>
              <th class="text-left">
                Estado
              </th>
              <th class="text-left">
                Total
              </th>
              <th class="text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>
                <div class="text-body-2">
                  #{{ order.id }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ formatDateTime(order.created_at) }}
                </div>
              </td>
              <td>
                <div class="text-body-2">
                  {{ order.items[0]?.ticket_category?.event_date?.event?.title || 'Evento' }}
                </div>
                <div
                  v-if="order.items[0]?.ticket_category?.event_date?.starts_at"
                  class="text-caption text-medium-emphasis"
                >
                  {{ formatDateTime(order.items[0].ticket_category.event_date.starts_at) }}
                </div>
              </td>
              <td>
                <v-chip
                  :color="statusColor(order.status)"
                  size="small"
                  variant="flat"
                >
                  {{ formatStatus(order.status) }}
                </v-chip>
              </td>
              <td>
                <div class="text-body-2">
                  {{ Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                  {{ order.currency }}
                </div>
              </td>
              <td class="text-right">
                <v-btn
                  size="small"
                  variant="text"
                  color="primary"
                  @click="goToOrder(order)"
                >
                  Ver
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <div
        v-if="paginator"
        class="d-flex justify-space-between align-center mt-4"
      >
        <div class="text-caption text-medium-emphasis">
          Pagina {{ paginator.current_page }} de {{ paginator.last_page }} &middot;
          {{ paginator.total }} ordenes
        </div>
        <div class="d-flex ga-2">
          <v-btn
            size="small"
            variant="text"
            :disabled="!paginator.prev_page_url"
            @click="changePage(paginator.current_page - 1)"
          >
            Anterior
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            :disabled="!paginator.next_page_url"
            @click="changePage(paginator.current_page + 1)"
          >
            Siguiente
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>
