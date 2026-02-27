<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthApiFetch, useAuthApi } from '~/composables/useAuthApiFetch'
import type { CheckoutOrder } from '~/types/api'

const route = useRoute()
const router = useRouter()
const orderId = computed(() => Number(route.query.order_id))

const order = ref<Order | null>(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const couponCode = ref('')
const applyingCoupon = ref(false)
const couponMessage = ref<string | null>(null)
const isCreatingCheckout = ref(false)

const authApi = useAuthApi()

const formatMoney = (value: string | number) => {
  const num = typeof value === 'string' ? Number(value) : value
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const fetchOrder = async () => {
  if (!orderId.value) {
    errorMessage.value = 'Orden no encontrada.'
    return
  }
  loading.value = true
  errorMessage.value = null
  try {
    const { data, error } = await useAuthApiFetch<CheckoutOrder>(`/orders/${orderId.value}`)
    if (error.value) {
      errorMessage.value = 'No se pudo cargar la orden.'
      return
    }
    order.value = data.value ?? null
  } finally {
    loading.value = false
  }
}

onMounted(fetchOrder)

const handleApplyCoupon = async () => {
  if (!order.value) return
  if (!couponCode.value.trim()) {
    couponMessage.value = 'Ingresa un codigo.'
    return
  }

  applyingCoupon.value = true
  couponMessage.value = null
  errorMessage.value = null

  try {
    const updated = await authApi<Order>(
      `/orders/${order.value.id}/apply-discount`,
      {
        method: 'POST',
        body: { code: couponCode.value.trim() },
      },
    )
    order.value = updated
    couponMessage.value = 'Codigo aplicado correctamente.'
    couponCode.value = ''
  } catch (err: any) {
    const status = err?.response?.status || err?.statusCode
    if (status === 422) {
      couponMessage.value =
        err?.data?.message ||
        err?.message ||
        'Codigo invalido o no aplicable.'
    } else if (status === 403) {
      couponMessage.value = 'No autorizado para aplicar este codigo.'
    } else {
      couponMessage.value = 'No se pudo aplicar el codigo.'
    }
  } finally {
    applyingCoupon.value = false
  }
}

const handleProceedToPayment = async () => {
  if (!order.value) return
  isCreatingCheckout.value = true
  errorMessage.value = null
  try {
    const result = await authApi<{ checkout_url: string }>(
      `/orders/${order.value.id}/checkout`,
      { method: 'POST' },
    )
    const url = result?.checkout_url
    if (url) window.location.href = url
  } catch (err: any) {
    errorMessage.value = 'No se pudo iniciar el pago.'
  } finally {
    isCreatingCheckout.value = false
  }
}
</script>

<template>
  <v-container class="py-6" max-width="900">
    <h1 class="text-h5 mb-4">
      Resumen de compra
    </h1>

    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ errorMessage }}
    </v-alert>

    <div v-if="loading" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="order">
      <v-row dense>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>Entradas</v-card-title>
            <v-divider />
            <v-list>
              <v-list-item
                v-for="item in order.items"
                :key="item.id"
              >
                <v-list-item-title>
                  {{ item.ticket_category_name_snapshot }}
                  &middot;
                  {{ item.ticket_category?.event_date?.event?.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.ticket_category?.event_date?.starts_at ? new Date(item.ticket_category.event_date.starts_at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '' }}
                  &middot; Cantidad: {{ item.quantity }}
                </v-list-item-subtitle>
                <template #append>
                  <div class="text-right">
                    <div class="text-body-2">
                      {{ formatMoney(item.unit_price) }} {{ order.currency }}
                    </div>
                    <div class="text-body-2 font-weight-medium">
                      {{ formatMoney(item.line_total) }} {{ order.currency }}
                    </div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card>

          <v-card>
            <v-card-title>Codigo de descuento</v-card-title>
            <v-card-text>
              <div class="d-flex ga-2">
                <v-text-field
                  v-model="couponCode"
                  label="Codigo"
                  
                  hide-details="auto"
                  density="comfortable"
                />
                <v-btn
                  color="primary"
                  :loading="applyingCoupon"
                  @click="handleApplyCoupon"
                >
                  Aplicar
                </v-btn>
              </div>
              <div v-if="couponMessage" class="text-caption mt-1">
                {{ couponMessage }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Resumen</v-card-title>
            <v-card-text>
              <div class="d-flex justify-space-between mb-1">
                <span>Subtotal</span>
                <span>{{ formatMoney(order.subtotal) }} {{ order.currency }}</span>
              </div>
              <div
                v-if="Number(order.discount_total) > 0"
                class="d-flex justify-space-between mb-1 text-success"
              >
                <span>Descuento</span>
                <span>-{{ formatMoney(order.discount_total) }} {{ order.currency }}</span>
              </div>
              <div class="d-flex justify-space-between mb-1">
                <span>Impuestos</span>
                <span>{{ formatMoney(order.tax_total) }} {{ order.currency }}</span>
              </div>
              <v-divider class="my-2" />
              <div class="d-flex justify-space-between font-weight-bold">
                <span>Total</span>
                <span>{{ formatMoney(order.total) }} {{ order.currency }}</span>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                block
                :loading="isCreatingCheckout"
                @click="handleProceedToPayment"
              >
                Proceder al pago
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
