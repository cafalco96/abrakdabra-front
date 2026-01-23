<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}>()

const onInput = (val: string) => {
  emits('update:modelValue', val)
}

const onEnter = () => {
  emits('search', props.modelValue)
}
</script>

<template>
  <v-text-field
    :model-value="modelValue"
    :placeholder="placeholder || 'Buscar eventos...'"
    variant="outlined"
    density="comfortable"
    color="primary"
    class="search-bar"
    clearable
    prepend-inner-icon="mdi-magnify"
    @update:model-value="onInput"
    @keyup.enter="onEnter"
  />
</template>

<style scoped lang="scss">
.search-bar {
  max-width: 420px;

  :deep(.v-field) {
    border-radius: 999px;
  }
}
</style>
