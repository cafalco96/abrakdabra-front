<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()

type LastEvent = {
  id: number
  title: string
  image?: string | null
}

const orderId = computed(() => Number(route.query.order_id || 0))
const lastEvent = ref<LastEvent | null>(null)

onMounted(() => {
  if (process.client) {
    try {
      const raw = localStorage.getItem('last_event')
      if (raw) {
        const parsed = JSON.parse(raw) as LastEvent
        if (parsed && parsed.id && parsed.title) {
          lastEvent.value = parsed
        }
      }
    } catch {}
  }
})

const goBackToEvent = () => {
  if (lastEvent.value?.id) {
    router.push(`/events/${lastEvent.value.id}`)
  } else {
    router.push('/')
  }
}

const goToOrders = () => {
  if (orderId.value) {
    router.push('/orders')
  } else {
    router.push('/')
  }
}
</script>

<template>
  <v-container class="py-10" max-width="700">
    <div class="text-center mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">
        Pago cancelado
      </h1>
      <p class="text-body-2 text-medium-emphasis">
        No se completó el proceso de pago. Puedes intentar nuevamente cuando desees.
      </p>
    </div>

    <v-card variant="flat" class="mb-4">
      <v-card-text>
        <p class="text-body-2 mb-2" v-if="orderId">
          Orden asociada: #{{ orderId }}
        </p>
        <p class="text-body-2 text-medium-emphasis">
          Si el problema persiste, revisa tu historial de órdenes para reintentar el pago o crea una nueva orden.
        </p>
      </v-card-text>
    </v-card>

    <v-card v-if="lastEvent" variant="flat" class="mb-4">
      <v-card-title>Último evento visitado</v-card-title>
      <v-card-text>
        <div class="d-flex align-center ga-4">
          <v-img
            v-if="lastEvent.image"
            :src="lastEvent.image"
            height="150"
            width="64"
            cover
            class="rounded"
          />
          <div class="text-subtitle-2">{{ lastEvent.title }}</div>
        </div>
      </v-card-text>
    </v-card>

    <div class="text-center mt-4 d-flex flex-wrap justify-center ga-3">
      <v-btn color="primary" @click="goToOrders">
        Ir a mis órdenes
      </v-btn>
      <v-btn variant="text" color="primary" @click="goBackToEvent">
        Volver al evento
      </v-btn>
    </div>
  </v-container>
</template>
