<script setup lang="ts">
type TicketStatus = 'available' | 'unavailable' | string

type TicketCategoryFormModel = {
  name: string
  price: number | null
  stock_total: number | null
  status: TicketStatus | null
}

const props = defineProps<{
  modelValue?: Partial<TicketCategoryFormModel>
  submitLabel?: string
}>()

const emits = defineEmits<{
  (e: 'submit', payload: TicketCategoryFormModel): void
}>()

const form = reactive<TicketCategoryFormModel>({
  name: props.modelValue?.name ?? '',
  price: props.modelValue?.price != null ? Number(props.modelValue.price) : null,
  stock_total:
    props.modelValue?.stock_total != null ? Number(props.modelValue.stock_total) : null,
  status: (props.modelValue?.status as TicketStatus | null) ?? 'available',
})

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    if (val.name !== undefined) form.name = val.name
    if (val.price !== undefined) form.price = val.price != null ? Number(val.price) : null
    if (val.stock_total !== undefined)
      form.stock_total = val.stock_total != null ? Number(val.stock_total) : null
    if (val.status !== undefined) form.status = val.status as TicketStatus | null
  },
  { deep: true }
)

const loading = ref(false)
const errorMessage = ref<string | null>(null)

const handleSubmit = async () => {
  errorMessage.value = null

  if (!form.name.trim()) {
    errorMessage.value = 'El nombre de la categoría es obligatorio.'
    return
  }

  if (form.price === null || form.price < 0) {
    errorMessage.value = 'El precio debe ser un número mayor o igual a 0.'
    return
  }

  if (form.stock_total === null || form.stock_total < 1) {
    errorMessage.value = 'El stock debe ser al menos 1.'
    return
  }

  loading.value = true
  try {
    const result = emits('submit', { ...form })
    // Si el handler devuelve una promesa, la esperamos
    if (result && typeof result === 'object' && 'then' in result) {
      await result
    }
  } catch (err) {
    console.error('Error al guardar:', err)
    errorMessage.value = 'Error al guardar la categoría.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      density="compact"
      class="mb-3"
    >
      {{ errorMessage }}
    </v-alert>

    <form @submit.prevent="handleSubmit">
      <v-text-field
        v-model="form.name"
        label="Nombre de la categoría"
        variant="outlined"
        density="comfortable"
        maxlength="255"
        required
        class="mb-3"
      />

      <v-text-field
        v-model.number="form.price"
        label="Precio"
        type="number"
        variant="outlined"
        density="comfortable"
        min="0"
        step="0.01"
        required
        class="mb-3"
      />

      <v-text-field
        v-model.number="form.stock_total"
        label="Stock total"
        type="number"
        variant="outlined"
        density="comfortable"
        min="1"
        step="1"
        required
        class="mb-3"
      />

      <v-text-field
        v-model="form.status"
        label="Estado (opcional, defecto: available)"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />

      <v-btn
        type="submit"
        color="primary"
        :loading="loading"
      >
        {{ submitLabel || 'Agregar ticket' }}
      </v-btn>
    </form>
  </div>
</template>
