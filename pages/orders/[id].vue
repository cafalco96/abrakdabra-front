<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthApiFetch } from '~/composables/useAuthApiFetch'

type OrderStatus = 'pending_payment' | 'paid' | 'cancelled'

type Ticket = {
  id: number
  order_item_id: number
  ticket_category_id: number
  code: string
  qr_payload: string | null
  status: string
  issued_at: string
  used_at: string | null
}

type OrderItem = {
  id: number
  order_id: number
  ticket_category_id: number
  quantity: number
  unit_price: string
  line_total: string
  event_date_id: number
  ticket_category_name_snapshot: string
  ticket_category: {
    id: number
    event_date_id: number
    name: string
    price: string
    stock_total: number
    stock_sold: number
    status: string
    event_date: {
      id: number
      event_id: number
      starts_at: string
      ends_at: string | null
      status: string
      event: {
        id: number
        title: string
        description: string | null
        image_path: string | null
        location: string | null
        status: string
        created_by: number
      }
    }
  }
  tickets?: Ticket[]
}

type Order = {
  id: number
  user_id: number
  status: OrderStatus
  subtotal: string
  discount_total: string
  tax_total: string
  total: string
  currency: string
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  created_at: string
  updated_at: string
  items: OrderItem[]
}

const route = useRoute()
const router = useRouter()

const orderId = computed(() => Number(route.params.id))

const { data, pending, error, refresh } = await useAuthApiFetch<Order>(`/orders/${orderId.value}`)

const order = computed(() => data.value ?? null)

const formatDateTime = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

// Obtener la fecha del primer evento de la orden
const firstEventDate = computed<string | null>(() => {
  if (!order.value?.items?.length) return null
  const firstItem = order.value.items[0]
  return firstItem?.ticket_category?.event_date?.starts_at ?? null
})

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

const formatTicketStatus = (status: string) => {
  switch (status) {
    case 'issued':
      return 'Emitido'
    case 'used':
      return 'Usado'
    case 'voided':
      return 'Anulado'
    default:
      return status
  }
}

const isRetrying = ref(false)
const isCancelling = ref(false)
const cancelError = ref<string | null>(null)

const retryCheckout = async () => {
  if (!order.value || order.value.status !== 'pending_payment') return

  isRetrying.value = true
  try {
    // Redirigir al resumen de checkout para permitir aplicar códigos
    // y luego proceder al pago con Stripe desde esa página
    await router.push({ path: '/checkout', query: { order_id: order.value.id } })
  } finally {
    isRetrying.value = false
  }
}

const cancelOrder = async () => {
  if (!order.value || order.value.status !== 'pending_payment') return

  isCancelling.value = true
  cancelError.value = null

  try {
    const { data: cancelledData, error: cancelErr } = await useAuthApiFetch<Order>(
      `/orders/${order.value.id}/cancel`,
      {
        method: 'POST',
      },
    )

    if (cancelErr.value) {
      cancelError.value =
        (cancelErr.value.data as any)?.message || 'No se pudo cancelar la orden.'
      return
    }

    if (cancelledData.value) {
      // Actualizamos la orden en memoria con el nuevo estado (cancelled)
      data.value = cancelledData.value
    }
  } catch (e) {
    cancelError.value = 'Ocurrió un error al cancelar la orden.'
  } finally {
    isCancelling.value = false
  }
}
</script>

<template>
  <v-container class="py-8" max-width="900">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5">
        Orden #{{ orderId }}
      </h1>
      <v-btn variant="text" color="primary" to="/orders">
        Volver al historial
      </v-btn>
    </div>

    <div v-if="pending" class="d-flex justify-center my-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error || !order">
      <v-alert type="error" variant="tonal">
        No se pudo cargar la orden.
      </v-alert>
    </div>

    <div v-else>
      <!-- Resumen principal -->
      <v-card variant="flat" class="mb-4">
        <v-card-text>
          <div class="d-flex flex-wrap justify-space-between ga-4">
            <div>
              <div class="text-caption text-medium-emphasis">
                Estado
              </div>
              <v-chip
                :color="statusColor(order.status)"
                size="small"
                variant="flat"
              >
                {{ formatStatus(order.status) }}
              </v-chip>
            </div>

            <div>
              <div class="text-caption text-medium-emphasis">
                Fecha de compra
              </div>
              <div class="text-body-2">
                {{ formatDateTime(order.created_at) }}
              </div>
            </div>

            <div>
              <div class="text-caption text-medium-emphasis">
                Fecha del evento
              </div>
              <div class="text-body-2">
                {{ firstEventDate ? formatDateTime(firstEventDate) : 'N/A' }}
              </div>
            </div>

            <div v-if="Number(order.discount_total) > 0">
              <div class="text-caption text-medium-emphasis">
                Descuento
              </div>
              <div class="text-body-2">
                {{ Number(order.discount_total).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                {{ order.currency }}
              </div>
            </div>

            <div>
              <div class="text-caption text-medium-emphasis">
                Total
              </div>
              <div class="text-body-2">
                {{ Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                {{ order.currency }}
              </div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions v-if="order.status === 'pending_payment'">
          <v-spacer />
          <v-btn
            variant="text"
            color="error"
            :loading="isCancelling"
            @click="cancelOrder"
          >
            Cancelar orden
          </v-btn>

          <v-btn
            color="primary"
            :loading="isRetrying"
            @click="retryCheckout"
          >
            Reintentar pago
          </v-btn>
        </v-card-actions>

        <v-alert
          v-if="cancelError"
          type="error"
          variant="tonal"
          class="mt-2"
        >
          {{ cancelError }}
        </v-alert>
      </v-card>

      <!-- Items de la orden -->
      <v-card variant="flat" class="mb-4">
        <v-card-title>
          Localidades
        </v-card-title>
        <v-card-text>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th class="text-left">
                  Localidad
                </th>
                <th class="text-left">
                  Evento / Fecha
                </th>
                <th class="text-right">
                  Cantidad
                </th>
                <th class="text-right">
                  Total línea
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td>
                  <div class="text-body-2">
                    {{ item.ticket_category_name_snapshot || item.ticket_category.name }}
                  </div>
                </td>
                <td>
                  <div class="text-body-2">
                    {{ item.ticket_category.event_date.event.title }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatDateTime(item.ticket_category.event_date.starts_at) }}
                  </div>
                </td>
                <td class="text-right">
                  {{ item.quantity }}
                </td>
                <td class="text-right">
                  {{ Number(item.line_total).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                  {{ order.currency }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <!-- Tickets (solo si está pagada y hay tickets cargados) -->
      <v-card
        v-if="order.status === 'paid' && order.items && order.items.some(i => i.tickets && i.tickets.length)"
        variant="flat"
      >
        <v-card-title>
          Tickets
        </v-card-title>
        <v-card-text>
          <div v-if="!order.items.some(i => i.tickets && i.tickets.length)" class="text-caption text-medium-emphasis">
            Tus tickets estarán disponibles aquí una vez procesado el pago.
          </div>

          <div v-else class="d-flex flex-column ga-4">
            <div
              v-for="item in order.items.filter(i => i.tickets && i.tickets.length)"
              :key="item.id"
            >
              <div class="text-subtitle-2 mb-2">
                {{ item.ticket_category_name_snapshot || item.ticket_category.name }}
                · {{ item.tickets.length }} ticket(s)
              </div>
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-left">
                      Código
                    </th>
                    <th class="text-left">
                      Estado
                    </th>
                    <th class="text-left">
                      Emitido
                    </th>
                    <th class="text-left">
                      Usado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ticket in item.tickets" :key="ticket.id">
                    <td class="text-body-2">
                      {{ ticket.code }}
                    </td>
                    <td class="text-body-2">
                      {{ formatTicketStatus(ticket.status) }}
                    </td>
                    <td class="text-body-2">
                      {{ formatDateTime(ticket.issued_at) }}
                    </td>
                    <td class="text-body-2">
                      {{ ticket.used_at ? formatDateTime(ticket.used_at) : '-' }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>
