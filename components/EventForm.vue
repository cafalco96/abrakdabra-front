<!-- components/EventForm.vue -->
<script setup lang="ts">
type EventStatus = 'upcoming' | 'on_sale' | 'sold_out' | 'cancelled' | 'finished'

type EventFormModel = {
  title: string
  description: string | null
  location: string
  status: EventStatus | null
  image_path?: string | null
}

const props = defineProps<{
  modelValue?: Partial<EventFormModel>
  submitLabel?: string
}>()

const emits = defineEmits<{
  (e: 'submit', payload: EventFormModel): void
}>()

const form = reactive<EventFormModel>({
  title: props.modelValue?.title ?? '',
  description: props.modelValue?.description ?? '',
  location: props.modelValue?.location ?? '',
  status: (props.modelValue?.status as EventStatus | null) ?? 'upcoming',
  image_path: props.modelValue?.image_path ?? null,
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)

const statusOptions: { label: string; value: EventStatus }[] = [
  { label: 'Próximo', value: 'upcoming' },
  { label: 'En venta', value: 'on_sale' },
  { label: 'Agotado', value: 'sold_out' },
  { label: 'Cancelado', value: 'cancelled' },
  { label: 'Finalizado', value: 'finished' },
]

const handleSubmit = () => {
  errorMessage.value = null

  if (!form.title.trim()) {
    errorMessage.value = 'El título es obligatorio.'
    return
  }

  if (!form.location.trim()) {
    errorMessage.value = 'La ubicación es obligatoria.'
    return
  }

  loading.value = true
  try {
    emits('submit', { ...form })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-card>
    <v-card-text>
      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        density="compact"
        class="mb-4"
      >
        {{ errorMessage }}
      </v-alert>

      <form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.title"
          label="Título del evento"
          variant="outlined"
          density="comfortable"
          maxlength="255"
          required
          class="mb-4"
        />

        <v-textarea
          v-model="form.description"
          label="Descripción"
          variant="outlined"
          density="comfortable"
          rows="4"
          auto-grow
          class="mb-4"
        />

        <v-text-field
          v-model="form.location"
          label="Ubicación"
          variant="outlined"
          density="comfortable"
          maxlength="255"
          required
          class="mb-4"
        />

        <v-select
          v-model="form.status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          label="Estado"
          variant="outlined"
          density="comfortable"
          class="mb-6"
        />

        <v-text-field
          v-model="form.image_path"
          label="URL de portada"
          variant="outlined"
          density="comfortable"
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          class="mb-6"
        />

        <v-btn
          type="submit"
          color="primary"
          :loading="loading"
        >
          {{ submitLabel || 'Guardar evento' }}
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>
