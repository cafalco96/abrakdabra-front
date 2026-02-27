<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthApiFetch, useAuthApi } from '~/composables/useAuthApiFetch'
import type { CheckoutOrder } from '~/types/api'

const route = useRoute()
const router = useRouter()
const orderId = computed(() => Number(route.query.order_id))

const order = ref<CheckoutOrder | null>(null)
const loading = ref(false)
const errorMessage = ref<string | null>(null)

const couponCode = ref('')
const applyingCoupon = ref(false)
const couponMessage = ref<string | null>(null)
const couponSuccess = ref(false)
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
    couponSuccess.value = false
    return
  }
  applyingCoupon.value = true
  couponMessage.value = null
  couponSuccess.value = false
  errorMessage.value = null
  try {
    const updated = await authApi<CheckoutOrder>(
      `/orders/${order.value.id}/apply-discount`,
      {
        method: 'POST',
        body: { code: couponCode.value.trim().toUpperCase() },
      },
    )
    order.value = updated
    couponMessage.value = 'Codigo aplicado correctamente.'
    couponSuccess.value = true
    couponCode.value = ''
  } catch (err: any) {
    couponSuccess.value = false
    const status = err?.response?.status || err?.statusCode || err?.status
    const message = err?.data?.message || err?.response?._data?.message || err?.message
    if (status === 422) {
      couponMessage.value = message || 'Codigo invalido o no aplicable.'
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
    errorMessage.value = 'No se pudo iniciar el pago. Intenta nuevamente.'
  } finally {
    isCreatingCheckout.value = false
  }
}
</script>

<template>
  <v-container class="py-8" max-width="700">
    <div v-if="loading" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>
    <div v-else-if="errorMessage && !order">
      <v-alert type="error" variant="tonal">
        {{ errorMessage }}
      </v-alert>
    </div>
    <div v-else-if="!order">
      <v-alert type="warning" variant="tonal">
        Orden no encontrada.
      </v-alert>
    </div>
    <div v-else>
      <h1 class="text-h5 mb-6">
        Resumen de tu orden
      </h1>

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <v-row>
        <!-- Items de la orden -->
        <v-col cols="12" md="7">
          <v-card variant="flat" class="mb-4">
            <v-card-title>Entradas</v-card-title>
            <v-card-text>
              <div
                v-for="item in order.items"
                :key="item.id"
                class="d-flex justify-space-between align-center mb-2"
              >
                <div>
                  <div class="text-body-2 font-weight-medium">
                    {{ item.ticket_category_name_snapshot }}
                  </div>
                  <div class="text-caption text-medium-emphasis">
                    {{ item.quantity }} x ${{ formatMoney(item.unit_price) }}
                  </div>
                </div>
                <span class="text-body-2">
                  ${{ formatMoney(item.line_total) }}
                </span>
              </div>
            </v-card-text>
          </v-card>

          <!-- Cupon de descuento -->
          <v-card variant="flat" class="mb-4">
            <v-card-title>Codigo de descuento</v-card-title>
            <v-card-text>
              <div
                v-if="order.discount_code_id"
                class="text-body-2 text-success d-flex align-center ga-2"
              >
                <v-icon size="small">mdi-check-circle</v-icon>
                Descuento aplicado correctamente.
              </div>
              <div v-else>
                <div class="d-flex ga-2 align-start">
                  <v-text-field
                    v-model="couponCode"
                    label="Codigo"
                    density="comfortable"
                    variant="outlined"
                    :disabled="applyingCoupon"
                    hide-details
                    class="flex-grow-1"
                    @keyup.enter="handleApplyCoupon"
                  />
                  <v-btn
                    variant="outlined"
                    :loading="applyingCoupon"
                    :disabled="!couponCode.trim()"
                    class="mt-1"
                    @click="handleApplyCoupon"
                  >
                    Aplicar
                  </v-btn>
                </div>
              </div>
              <div
                v-if="couponMessage"
                class="mt-2 text-body-2"
                :class="couponSuccess ? 'text-success' : 'text-error'"
              >
                {{ couponMessage }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Resumen de precios -->
        <v-col cols="12" md="5">
          <v-card variant="flat">
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
