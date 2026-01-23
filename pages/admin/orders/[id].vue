<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['role-admin-gestor'],
})

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

type AdminOrderItem = {
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
    name: string
    event_date: {
      starts_at: string
      event: {
        id: number
        title: string
      }
    }
  }
  tickets?: Ticket[]
}

type AdminOrder = {
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
  user: {
    id: number
    name: string
    email: string
  }
  payment: {
    id: number
    provider: string
    environment: string | null
    stripe_payment_intent_id: string | null
    status: string
    amount: string
    currency: string
    paid_at: string | null
  } | null
  items: AdminOrderItem[]
}

const route = useRoute()
const router = useRouter()

const orderId = computed(() => Number(route.params.id))

const { data, pending, error, refresh } = await useAuthApiFetch<AdminOrder>(
  () => `/admin/orders/${orderId.value}`,
)

const order = computed(() => data.value ?? null)

const formatDateTime = (iso: string | null) => {
  if (!iso) return '-'
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

const goBack = () => {
  router.push('/admin/orders')
}

const isUpdatingStatus = ref(false)
const statusUpdateError = ref<string | null>(null)

const updateStatus = async (newStatus: OrderStatus) => {
  if (!order.value || order.value.status !== 'pending_payment') return

  isUpdatingStatus.value = true
  statusUpdateError.value = null

  try {
    const { data: updated, error: updateError } = await useAuthApiFetch<AdminOrder>(
      `/admin/orders/${order.value.id}`,
      {
        method: 'PUT',
        body: { status: newStatus },
      },
    )

    if (updateError.value) {
      statusUpdateError.value =
        (updateError.value.data as any)?.message ||
        'No se pudo actualizar el estado de la orden.'
      return
    }

    if (updated.value) {
      data.value = updated.value
    }
  } catch (e) {
    statusUpdateError.value = 'Ocurrió un error al actualizar el estado.'
  } finally {
    isUpdatingStatus.value = false
  }
}
</script>

<template>
  <v-container class="py-8" max-width="1000">
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h5">
        Orden #{{ orderId }}
      </h1>
      <v-btn variant="text" color="primary" @click="goBack">
        Volver a órdenes
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
      <!-- Resumen + comprador -->
      <v-row class="mb-4" dense>
        <v-col cols="12" md="8">
          <v-card variant="flat">
            <v-card-title>
              Resumen
            </v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-4 mb-4">
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
                    Creada
                  </div>
                  <div class="text-body-2">
                    {{ formatDateTime(order.created_at) }}
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

              <div v-if="order.status === 'pending_payment'">
                <div class="text-caption text-medium-emphasis mb-2">
                  Actualizar estado:
                </div>
                <div class="d-flex flex-wrap ga-2">
                  <v-btn
                    size="small"
                    color="success"
                    :loading="isUpdatingStatus"
                    @click="updateStatus('paid')"
                  >
                    Marcar como pagada (offline)
                  </v-btn>
                  <v-btn
                    size="small"
                    color="error"
                    variant="text"
                    :loading="isUpdatingStatus"
                    @click="updateStatus('cancelled')"
                  >
                    Cancelar orden
                  </v-btn>
                </div>
                <v-alert
                  v-if="statusUpdateError"
                  type="error"
                  variant="tonal"
                  density="compact"
                  class="mt-2"
                >
                  {{ statusUpdateError }}
                </v-alert>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card variant="flat">
            <v-card-title>
              Comprador
            </v-card-title>
            <v-card-text class="text-body-2">
              <div class="mb-1">
                <strong>Nombre:</strong> {{ order.user.name }}
              </div>
              <div class="mb-1">
                <strong>Email:</strong> {{ order.user.email }}
              </div>
              <div class="mb-1">
                <strong>ID usuario:</strong> {{ order.user.id }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Información de pago -->
      <v-card variant="flat" class="mb-4">
        <v-card-title>
          Pago
        </v-card-title>
        <v-card-text class="text-body-2">
          <div v-if="order.stripe_session_id || order.stripe_payment_intent">
            <div class="mb-1">
              <strong>Proveedor:</strong> Stripe
            </div>
            <div class="mb-1">
              <strong>Estado de orden:</strong> {{ formatStatus(order.status) }}
            </div>
            <div class="mb-1">
              <strong>Monto:</strong>
              {{ Number(order.total).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
              {{ order.currency }}
            </div>
            <div class="mb-1" v-if="order.stripe_session_id">
              <strong>Session ID:</strong> 
              <span class="text-caption">{{ order.stripe_session_id }}</span>
            </div>
            <div class="mb-1" v-if="order.stripe_payment_intent">
              <strong>Payment Intent:</strong> 
              <span class="text-caption">{{ order.stripe_payment_intent }}</span>
            </div>
            <div v-if="order.payment" class="mt-3 pt-3" style="border-top: 1px solid rgba(0,0,0,0.12);">
              <div class="text-caption text-medium-emphasis mb-2">
                Registro de Payment
              </div>
              <div class="mb-1">
                <strong>Estado payment:</strong> {{ order.payment.status }}
              </div>
              <div class="mb-1" v-if="order.payment.paid_at">
                <strong>Pagado en:</strong> {{ formatDateTime(order.payment.paid_at) }}
              </div>
              <div class="mb-1" v-if="order.payment.environment">
                <strong>Ambiente:</strong> {{ order.payment.environment }}
              </div>
            </div>
          </div>
          <div v-else class="text-caption text-medium-emphasis">
            No hay información de pago disponible.
          </div>
        </v-card-text>
      </v-card>

      <!-- Items -->
      <v-card variant="flat" class="mb-4">
        <v-card-title>
          Localidades
        </v-card-title>
        <v-card-text>
          <v-table density="comfortable">
            <thead>
              <tr>
                <th>Localidad</th>
                <th>Evento / Fecha</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Total línea</th>
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

      <!-- Tickets -->
      <v-card
        v-if="order.status === 'paid'"
        variant="flat"
      >
        <v-card-title>
          Tickets
        </v-card-title>
        <v-card-text>
          <div
            v-if="!order.items.some(i => i.tickets && i.tickets.length)"
            class="text-caption text-medium-emphasis"
          >
            Tus tickets estarán disponibles aquí una vez procesado el pago.
          </div>

          <div v-else class="d-flex flex-column ga-4">
            <template
              v-for="item in order.items"
              :key="item.id"
            >
              <div v-if="item.tickets && item.tickets.length">
                <div class="text-subtitle-2 mb-2">
                  {{ item.ticket_category_name_snapshot || item.ticket_category.name }}
                  · {{ item.tickets.length }} ticket(s)
                </div>
                <v-table density="compact">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Estado</th>
                      <th>Emitido</th>
                      <th>Usado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ticket in item.tickets" :key="ticket.id">
                      <td>{{ ticket.code }}</td>
                      <td>{{ ticket.status }}</td>
                      <td>{{ formatDateTime(ticket.issued_at) }}</td>
                      <td>{{ ticket.used_at ? formatDateTime(ticket.used_at) : '-' }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </template>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>
