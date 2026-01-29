<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useApiFetch } from '~/composables/useApiFetch'
import { getEventStatusMeta } from '~/utils/eventStatus'
import { getEventDateStatusMeta } from '~/utils/eventDateStatus'
import type { PublicEventDetail, PublicEventDate } from '~/types/api'

const route = useRoute()
const eventId = computed(() => route.params.id)

const { data, pending, error } = await useApiFetch<PublicEventDetail>(
  `/public/events/${eventId.value}`,
)

const event = computed(() => data.value ?? null)

// fecha principal: primera fecha ordenada por starts_at
const mainDate = computed<EventDate | null>(() => {
  if (!event.value || !event.value.dates?.length) return null
  return [...event.value.dates].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  )[0]
})

// Cantidad de fechas adicionales
const additionalDatesCount = computed(() => {
  if (!event.value?.dates?.length) return 0
  return event.value.dates.length - 1
})

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

const heroImage = computed(() =>
  event.value?.image_path || '/images/default.webp',
)

const statusMeta = computed(() =>
  event.value ? getEventStatusMeta(event.value.status) : null,
)

// Guardar último evento visitado en localStorage (solo cliente)
if (process.client) {
  watch(event, (val) => {
    if (val) {
      try {
        const lastEvent = {
          id: val.id,
          title: val.title,
          image: heroImage.value,
        }
        localStorage.setItem('last_event', JSON.stringify(lastEvent))
      } catch {}
    }
  }, { immediate: true })
}

// Lógica de compra
const { isAuthenticated } = useAuth()
const router = useRouter()

// Selección de fecha
const selectedDateId = ref<number | null>(null)

const availableDates = computed(() =>
  event.value?.dates?.filter(d => d.ticket_categories?.length) ?? [],
)

const selectedDate = computed<EventDate | null>(() => {
  if (!availableDates.value.length) return null
  const found = availableDates.value.find(d => d.id === selectedDateId.value)
  return found ?? availableDates.value[0]
})

// Inicializar fecha seleccionada cuando llegue el evento
watch(
  availableDates,
  (dates) => {
    if (dates.length && !selectedDateId.value) {
      selectedDateId.value = dates[0].id
    }
  },
  { immediate: true },
)

// Estado para las cantidades seleccionadas por categoría
const selectedQuantities = ref<Record<number, number>>({})

watchEffect(() => {
  const date = selectedDate.value
  if (!date) return

  const newState: Record<number, number> = {}
  date.ticket_categories.forEach(cat => {
    newState[cat.id] = selectedQuantities.value[cat.id] || 0
  })
  selectedQuantities.value = newState
})

const isCreatingOrder = ref(false)

const handlePurchase = async () => {
  if (!isAuthenticated.value) {
    return router.push('/auth/login')
  }

  const items = Object.entries(selectedQuantities.value)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => ({
      ticket_category_id: Number(id),
      quantity: qty
    }))

  if (items.length === 0) return

  isCreatingOrder.value = true
  try {
    // 1. Crear la orden
    const { data: orderData, error: orderError } = await useAuthApiFetch<{ id: number }>('/orders', {
      method: 'POST',
      body: { items }
    })

    if (orderError.value) throw orderError.value

    // 2. Ir al resumen de checkout para aplicar cupones y pagar
    if (orderData.value?.id) {
      router.push({ path: '/checkout', query: { order_id: orderData.value.id } })
    }
  } catch (err) {
    console.error('Error en la compra:', err)
  } finally {
    isCreatingOrder.value = false
  }
}

const totalAmount = computed(() => {
  const date = selectedDate.value
  if (!date) return 0

  return date.ticket_categories.reduce((acc, cat) => {
    const qty = selectedQuantities.value[cat.id] || 0
    return acc + Number(cat.price) * qty
  }, 0)
})

const hasSelectedTickets = computed(() => {
  return Object.values(selectedQuantities.value).some(qty => qty > 0)
})
</script>
<template>
  <v-container class="pa-0" fluid>
    <div v-if="pending" class="d-flex justify-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="error">
      <v-container class="py-10">
        <v-alert type="error" variant="tonal">
          No se pudo cargar el evento.
        </v-alert>
      </v-container>
    </div>

    <div v-else-if="!event">
      <v-container class="py-10">
        <v-alert type="warning" variant="tonal">
          Evento no encontrado.
        </v-alert>
      </v-container>
    </div>

    <div v-else>
      <!-- Hero -->
      <div class="position-relative">
        <v-img
          :src="heroImage"
          height="320"
          cover
        >
          <template #gradient>
            <div
              class="w-100 h-100"
              style="background: linear-gradient(to top, rgba(0,0,0,0.55), transparent);"
            />
          </template>
        </v-img>
      </div>

      <v-container class="py-6" max-width="900">
        <!-- Título y estado -->
        <div class="text-center mb-4">
          <h1 class="text-h4 text-md-h3 mb-2">
            {{ event.title }}
          </h1>

          <div class="d-flex flex-wrap justify-center align-center ga-2">
            <v-chip
              v-if="statusMeta"
              :color="statusMeta.color"
              variant="flat"
              size="small"
            >
              {{ statusMeta.label }}
            </v-chip>

            <span
              v-if="mainDate"
              class="text-body-2 text-medium-emphasis"
            >
              {{ formatDateTime(mainDate.starts_at) }}
              <span v-if="mainDate.ends_at">
                &nbsp;–&nbsp;{{ formatDateTime(mainDate.ends_at) }}
              </span>
            </span>

            <v-chip
              v-if="additionalDatesCount > 0"
              variant="outlined"
              size="small"
            >
              + {{ additionalDatesCount }} fecha{{ additionalDatesCount > 1 ? 's' : '' }} más
            </v-chip>
          </div>

          <p
            v-if="event.location"
            class="text-body-2 text-medium-emphasis mt-2"
          >
            {{ event.location }}
          </p>
        </div>

        <v-row dense>
          <!-- Descripción y detalle -->
          <v-col cols="12" md="8">
            <v-card variant="flat" class="mb-4">
              <v-card-title>Descripción</v-card-title>
              <v-card-text class="text-body-2">
                {{ event.description || 'Próximamente más detalles.' }}
              </v-card-text>
            </v-card>

            <v-card
              v-if="event.dates && event.dates.length"
              variant="flat"
              class="mb-4"
            >
              <v-card-title>Fechas</v-card-title>
              <v-card-text>
                <v-timeline
                  density="compact"
                  side="end"
                >
                  <v-timeline-item
                    v-for="date in event.dates"
                    :key="date.id"
                    dot-color="primary"
                    size="small"
                  >
                    <div class="text-body-2">
                      <strong>{{ formatDateTime(date.starts_at) }}</strong>
                      <span v-if="date.ends_at">
                        &nbsp;–&nbsp;{{ formatDateTime(date.ends_at) }}
                      </span>
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Estado: {{ getEventDateStatusMeta(date.status).label }}
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Localidades / tickets -->
          <v-col cols="12" md="4">
            <v-card variant="flat">
              <v-card-title>Localidades</v-card-title>
              <v-card-text>
                <div v-if="!availableDates.length">
                  <p class="text-caption text-medium-emphasis mb-0">
                    Próximamente se anunciarán las localidades y precios.
                  </p>
                </div>

                <div v-else>
                  <v-select
                    v-model="selectedDateId"
                    :items="availableDates"
                    item-value="id"
                    label="Fecha del evento"
                    density="comfortable"
                  >
                    <template #selection="{ item }">
                      {{ formatDateTime(item.raw.starts_at) }}
                    </template>
                    <template #item="{ item, props }">
                      <v-list-item v-bind="props">
                        <template #title>
                          {{ formatDateTime(item.raw.starts_at) }}
                        </template>
                        <template #subtitle>
                          {{ getEventDateStatusMeta(item.raw.status).label }}
                        </template>
                      </v-list-item>
                    </template>
                  </v-select>

                  <TicketSelector
                    v-if="selectedDate && selectedDate.ticket_categories.length"
                    v-model="selectedQuantities"
                    :ticket-categories="selectedDate.ticket_categories"
                    class="mt-4"
                  />
                  <div
                    v-else
                    class="text-caption text-medium-emphasis mt-2"
                  >
                    No hay localidades disponibles para esta fecha.
                  </div>
                </div>
              </v-card-text>

              <v-divider v-if="hasSelectedTickets" />

              <v-card-text v-if="hasSelectedTickets">
                <div class="d-flex justify-space-between align-center">
                  <span class="text-subtitle-1 font-weight-bold">Total:</span>
                  <span class="text-h6 text-primary font-weight-bold">
                    ${{ totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
                  </span>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="primary"
                  block
                  :disabled="!hasSelectedTickets"
                  :loading="isCreatingOrder"
                  @click="handlePurchase"
                >
                  {{ isAuthenticated ? 'Proceder al pago' : 'Iniciar sesión para comprar' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div class="mt-6 text-center">
          <v-btn
            variant="text"
            color="primary"
            to="/"
          >
            Volver
          </v-btn>
        </div>
      </v-container>
    </div>
  </v-container>
</template>
