<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

import { useAuthApiFetch } from '~/composables/useAuthApiFetch'
import type { AdminOrdersPaginated } from '~/types/api'

const router = useRouter()

const page = ref(1)
const statusFilter = ref<string[]>([])
const buyerEmailFilter = ref('')

const statusOptions = [
  { label: 'Pendiente de pago', value: 'pending_payment' },
  { label: 'Pagada', value: 'paid' },
  { label: 'Cancelada', value: 'cancelled' },
]

const { data, pending, error, refresh } = await useAuthApiFetch<AdminOrdersPaginated>(
  '/admin/orders',
  {
    query: computed(() => ({
      page: page.value,
      status: statusFilter.value.length > 0 ? statusFilter.value.join(',') : undefined,
      buyer_email: buyerEmailFilter.value || undefined,
    })),
  },
)

const orders = computed(() => data.value?.data ?? [])
const paginator = computed(() => data.value)

const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

type AdminOrderStatus = 'pending_payment' | 'paid' | 'cancelled'

const formatStatus = (status: AdminOrderStatus) => {
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

const statusColor = (status: AdminOrderStatus) => {
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

const getEventTitle = (order: any) => {
  return order?.items?.[0]?.ticket_category?.event_date?.event?.title ?? 'Evento'
}

const getEventDate = (order: any) => {
  return order?.items?.[0]?.ticket_category?.event_date?.starts_at ?? null
}

const changePage = async (newPage: number) => {
  if (!paginator.value) return
  if (newPage < 1 || newPage > paginator.value.last_page) return
  page.value = newPage
  await refresh()
}

const applyFilters = async () => {
  page.value = 1
  await refresh()
}

const clearFilters = async () => {
  statusFilter.value = []
  buyerEmailFilter.value = ''
  page.value = 1
  await refresh()
}

const goToOrder = (order: any) => {
  router.push(`/admin/orders/${order.id}`)
}
</script>

<template>
  <v-container class="py-8" max-width="1100">
    <h1 class="text-h5 mb-4">
      Ordenes
    </h1>

    <!-- Filtros -->
    <div class="mb-6 d-flex flex-column flex-md-row gap-3 align-md-center">
      <SearchBar
        v-model="buyerEmailFilter"
        placeholder="Buscar por email del comprador..."
        @update:model-value="applyFilters"
      />
      <SearchTags
        v-model="statusFilter"
        :options="statusOptions"
        label="Filtrar por estado"
        @update:model-value="applyFilters"
      />
      <v-btn
        v-if="statusFilter.length > 0 || buyerEmailFilter"
        variant="text"
        color="primary"
        @click="clearFilters"
      >
        Limpiar filtros
      </v-btn>
    </div>

    <!-- Tabla -->
    <div v-if="pending" class="d-flex justify-center my-10">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else-if="error">
      <v-alert type="error" variant="tonal">
        No se pudieron cargar las ordenes.
      </v-alert>
    </div>
    <div v-else-if="!orders.length">
      <v-alert type="info" variant="tonal">
        No hay ordenes que coincidan con los filtros.
      </v-alert>
    </div>
    <div v-else>
      <v-card variant="flat">
        <v-table density="comfortable">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Comprador</th>
              <th>Evento</th>
              <th>Estado</th>
              <th>Total</th>
              <th class="text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
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
                  {{ order.user?.name ?? '-' }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ order.user?.email ?? '-' }}
                </div>
              </td>
              <td>
                <div class="text-body-2">
                  {{ getEventTitle(order) }}
                </div>
                <div
                  v-if="getEventDate(order)"
                  class="text-caption text-medium-emphasis"
                >
                  {{ formatDateTime(getEventDate(order)) }}
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
          Pagina {{ paginator.current_page }} de {{ paginator.last_page }} ·
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
