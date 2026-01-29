<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAuthApiFetch } from '~/composables/useAuthApiFetch'
import { getOrderStatusMeta } from '~/utils/orderStatus'
import type { CheckoutSuccessOrder } from '~/types/api'

const route = useRoute()
const router = useRouter()

// ?order_id=4&session_id=cs_test_...
const orderId = computed(() => Number(route.query.order_id || 0))
const sessionId = computed(() => String(route.query.session_id || ''))

const isLoading = ref(true)
const hasError = ref(false)
const errorMessage = ref<string | null>(null)

// Opcional: datos de la orden para mostrar resumen
type Order = CheckoutSuccessOrder
const order = ref<Order | null>(null)
const orderStatusMeta = computed(() => order.value ? getOrderStatusMeta(order.value.status) : null)

// Obtener la orden por GET sin marcar como pagada manualmente
const fetchOrder = async () => {
  if (!orderId.value) {
    hasError.value = true
    errorMessage.value = 'Falta el identificador de la orden en la URL.'
    isLoading.value = false
    return
  }

  try {
    const { data, error } = await useAuthApiFetch<Order>(`/orders/${orderId.value}`)

    if (error.value) {
      hasError.value = true
      errorMessage.value = error.value?.data?.message || 'No se pudo cargar la orden.'
    } else {
      order.value = data.value ?? null
    }
  } catch (e: any) {
    hasError.value = true
    errorMessage.value = 'Ocurrió un error al cargar la orden.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Si no hay order_id, no tiene sentido llamar al backend
  if (!orderId.value) {
    isLoading.value = false
    hasError.value = true
    errorMessage.value = 'Orden no encontrada en la URL.'
    return
  }

  fetchOrder()
})

const goToOrders = () => {
  router.push('/orders') // luego haremos esta página
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <v-container class="py-10" max-width="700">
    <div class="text-center mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        ¡Pago exitoso!
      </h1>
      <p class="text-body-2 text-medium-emphasis">
        Gracias por tu compra. Tus boletos ya han sido generados o lo serán en unos instantes.
      </p>
    </div>

    <div v-if="isLoading" class="d-flex justify-center my-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="hasError">
      <v-alert type="warning" variant="tonal" class="mb-4">
        {{ errorMessage }}
      </v-alert>

      <div class="text-center mt-4">
        <v-btn color="primary" class="mr-2" @click="goHome">
          Ir al inicio
        </v-btn>
      </div>
    </div>

    <div v-else>
      <v-card variant="flat" class="mb-4">
        <v-card-title>
          Resumen de la orden
        </v-card-title>
        <v-card-text v-if="order">
          <p class="text-body-2 mb-1">
            <strong>Orden #{{ order.id }}</strong>
          </p>
          <div class="d-flex align-center ga-2 mb-1">
            <span class="text-body-2">Estado:</span>
            <v-chip v-if="orderStatusMeta" :color="orderStatusMeta.color" size="small" variant="tonal">
              {{ orderStatusMeta.label }}
            </v-chip>
            <span v-else class="text-body-2">{{ order.status }}</span>
          </div>
          <p class="text-body-2 mb-1">
            Total pagado: {{ order.total }} {{ order.currency }}
          </p>
        </v-card-text>
        <v-card-text v-else>
          <p class="text-body-2 text-medium-emphasis">
            No se pudo cargar el detalle de la orden, pero tu pago fue procesado correctamente.
          </p>
        </v-card-text>
      </v-card>

      <div class="text-center mt-4 d-flex flex-wrap justify-center ga-3">
        <v-btn color="primary" @click="goToOrders">
          Ver mis órdenes
        </v-btn>
        <v-btn variant="text" color="primary" @click="goHome">
          Ir al inicio
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
