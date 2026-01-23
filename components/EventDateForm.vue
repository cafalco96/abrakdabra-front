<script setup lang="ts">
type EventDateStatus = 'scheduled' | 'finished' | 'cancelled'

type EventDateFormModel = {
  starts_at: string
  ends_at: string | null
  status: EventDateStatus | null
}

const props = defineProps<{
  modelValue?: Partial<EventDateFormModel>
  submitLabel?: string
}>()

const emits = defineEmits<{
  (e: 'submit', payload: EventDateFormModel): void
}>()

const formatToInput = (value?: string | null) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''

  const pad = (n: number) => n.toString().padStart(2, '0')

  const yyyy = d.getUTCFullYear()
  const mm = pad(d.getUTCMonth() + 1)
  const dd = pad(d.getUTCDate())
  const hh = pad(d.getUTCHours())
  const mi = pad(d.getUTCMinutes())

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

const form = reactive<EventDateFormModel>({
  starts_at: formatToInput(props.modelValue?.starts_at) || '',
  ends_at: formatToInput(props.modelValue?.ends_at) || '',
  status: (props.modelValue?.status as EventDateStatus | null) ?? 'scheduled',
})

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return
    if (val.starts_at !== undefined) form.starts_at = formatToInput(val.starts_at) || ''
    if (val.ends_at !== undefined) form.ends_at = formatToInput(val.ends_at) || ''
    if (val.status !== undefined) form.status = val.status as EventDateStatus | null
  },
  { deep: true }
)

const loading = ref(false)
const errorMessage = ref<string | null>(null)

const statusOptions: { label: string; value: EventDateStatus }[] = [
  { label: 'Programado', value: 'scheduled' },
  { label: 'Finalizado', value: 'finished' },
  { label: 'Cancelado', value: 'cancelled' },
]

const handleSubmit = () => {
  errorMessage.value = null

  if (!form.starts_at) {
    errorMessage.value = 'La fecha/hora de inicio es obligatoria.'
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
      <!-- Por simplicidad usamos datetime-local; luego se puede cambiar a v-date-input + v-time-input -->
      <v-text-field
        v-model="form.starts_at"
        label="Inicio"
        type="datetime-local"
        variant="outlined"
        density="comfortable"
        required
        class="mb-3"
      />

      <v-text-field
        v-model="form.ends_at"
        label="Fin (opcional)"
        type="datetime-local"
        variant="outlined"
        density="comfortable"
        class="mb-3"
      />

      <v-select
        v-model="form.status"
        :items="statusOptions"
        item-title="label"
        item-value="value"
        label="Estado"
        variant="outlined"
        density="comfortable"
        class="mb-4"
      />

      <v-btn
        type="submit"
        color="primary"
        :loading="loading"
      >
        {{ submitLabel || 'Agregar fecha' }}
      </v-btn>
    </form>
  </div>
</template>
