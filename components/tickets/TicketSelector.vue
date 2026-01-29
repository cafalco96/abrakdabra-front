<script setup lang="ts">
import type { TicketCategory } from '~/types/eventDate'

const props = defineProps<{
  ticketCategories: TicketCategory[]
  modelValue: Record<number, number>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<number, number>): void
}>()

const quantities = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const updateQuantity = (categoryId: number, newValue: number) => {
  quantities.value = {
    ...quantities.value,
    [categoryId]: newValue
  }
}

const incrementQuantity = (categoryId: number, maxStock: number) => {
  const current = quantities.value[categoryId] || 0
  updateQuantity(categoryId, Math.min(maxStock, current + 1))
}

const decrementQuantity = (categoryId: number) => {
  const current = quantities.value[categoryId] || 0
  updateQuantity(categoryId, Math.max(0, current - 1))
}
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <div
      v-for="cat in ticketCategories"
      :key="cat.id"
      class="pa-3 rounded border"
    >
      <div class="d-flex justify-space-between align-center mb-2">
        <div>
          <div class="text-subtitle-2">{{ cat.name }}</div>
          <div class="text-body-2 text-primary font-weight-bold">
            ${{ Number(cat.price).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
          </div>
        </div>
        <div v-if="cat.status === 'available'" class="text-caption text-medium-emphasis">
          {{ cat.stock_total - cat.stock_sold }} disponibles
        </div>
      </div>

      <div v-if="cat.status === 'available' && (cat.stock_total - cat.stock_sold) > 0" class="d-flex align-center gap-2">
        <v-btn
          icon="mdi-minus"
          size="small"
          variant="outlined"
          density="comfortable"
          :disabled="!quantities[cat.id] || quantities[cat.id] === 0"
          @click="decrementQuantity(cat.id)"
        />
        <v-text-field
          :model-value="quantities[cat.id] || 0"
          type="number"
          min="0"
          :max="cat.stock_total - cat.stock_sold"
          variant="outlined"
          density="compact"
          hide-details
          class="ticket-quantity-input mx-2"
          @update:model-value="(val) => updateQuantity(cat.id, Number(val) || 0)"
        />
        <v-btn
          icon="mdi-plus"
          size="small"
          variant="outlined"
          density="comfortable"
          :disabled="(quantities[cat.id] || 0) >= (cat.stock_total - cat.stock_sold)"
          @click="incrementQuantity(cat.id, cat.stock_total - cat.stock_sold)"
        />
      </div>
      <div v-else class="text-caption text-error">
        No disponible
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ticket-quantity-input {
  max-width: 80px;

  :deep(input) {
    text-align: center;
  }
}
</style>
