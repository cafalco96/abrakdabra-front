<script setup lang="ts">
import { getEventStatusMeta } from '~/utils/eventStatus'

const props = defineProps<{
  event: {
    id: number
    title: string
    description?: string
    location?: string
    status?: string
    created_at?: string
    image_path?: string
  }
}>()

const eventImage = computed(() =>
  props.event.image_path || '/images/default.webp',
)
</script>

<template>
  <router-link :to="`/events/${event.id}`" class="event-tile-link">
    <v-card class="h-100">
      <v-img
        :src="eventImage"
        height="200"
        cover
        class="mb-2"
      />
      <v-card-title>{{ event.title }}</v-card-title>
      <v-card-subtitle>
        {{ event.location || "Ubicación por definir" }}
        <span v-if="event.status"> · {{ getEventStatusMeta(event.status).label }}</span>
      </v-card-subtitle>
      <v-card-subtitle
        v-if="event.created_at"
        class="text-caption text-medium-emphasis"
      >
        Publicado {{ new Date(event.created_at).toLocaleDateString() }}
      </v-card-subtitle>
      <v-card-text>
        {{ event.description || "Próximamente más detalles." }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" size="small">
          Ver detalles
        </v-btn>
      </v-card-actions>
    </v-card>
  </router-link>
</template>

<style scoped>
.event-tile-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.event-tile-link:hover {
  transform: translateY(-4px);
}

.event-tile-link:hover :deep(.v-card) {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}
</style>
