<script setup lang="ts">
import type { SearchOption } from '~/types/search'

const props = defineProps<{
  modelValue: string[]         // array para múltiples tags
  options: SearchOption[]
  label?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const onChange = (val: string[] | string) => {
  emits('update:modelValue', Array.isArray(val) ? val : [val])
}
</script>

<template>
  <v-select
    :items="options"
    item-title="label"
    item-value="value"
    :model-value="modelValue"
    :label="label || 'Filtrar por categoría'"
    variant="outlined"
    density="comfortable"
    color="primary"
    class="search-tags"
    multiple
    chips
    clearable
    @update:model-value="onChange"
  />
</template>

<style scoped lang="scss">
.search-tags {
  max-width: 360px;

  :deep(.v-field) {
    border-radius: 999px;
  }
}
</style>
