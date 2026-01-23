<script setup lang="ts">
import FooterComponent from "~/components/FooterComponent.vue";
import { useApiFetch } from "../composables/useApiFetch";

// Usa un asset servido desde /public; ajusta el nombre al mover tu archivo.
const heroBackground = '/videos/que-lloro.mp4'

type PublicEvent = {
  id: number;
  title: string;
  description?: string;
  location?: string;
  status?: string;
  created_at?: string;
};

type PublicEventsResponse = {
  data: PublicEvent[];
  current_page?: number;
  last_page?: number;
};

const { data, pending, error } = await useApiFetch<PublicEventsResponse>(
  "/public/events"
);

const events = computed(
  () => data.value?.data?.filter((item) => item && item.id != null) ?? []
);

const searchTerm = ref('')
const selectedCities = ref<string[]>([])

const extractCity = (location?: string) => {
  if (!location) return ''
  return location.split(',')[0].trim()
}

const cityOptions = computed(() => {
  const cities = new Set<string>()
  events.value.forEach((e) => {
    const city = extractCity(e.location)
    if (city) cities.add(city)
  })
  return Array.from(cities).map((city) => ({ label: city, value: city }))
})

const filteredEvents = computed(() => {
  const term = searchTerm.value.toLowerCase().trim()
  return events.value.filter((event) => {
    const city = extractCity(event.location)
    const matchesCity =
      selectedCities.value.length === 0 || selectedCities.value.includes(city)

    const haystack = [event.title, event.description, event.location]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    const matchesTerm = term === '' || haystack.includes(term)

    return matchesCity && matchesTerm
  })
})
</script>

<template>
  <div>
    <HeroSection
      :background="heroBackground"
      title="Vive la magia del directo"
      subtitle="Conciertos de rock, metal y experiencias únicas. Descubre los próximos eventos y asegura tus entradas en segundos."
      chip="Eventos en Ecuador"
      cta-label="Ver próximos eventos"
      cta-to="#event-list"
    />

    <v-container id="event-list">
      <h1 class="text-h5 mb-4 section-title">Eventos disponibles</h1>

      <v-row class="mb-4" align="center" justify="space-between">
        <v-col cols="12" md="6">
          <SearchBar
            v-model="searchTerm"
            placeholder="Buscar ..."
            @search="(val) => (searchTerm = val)"
          />
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-end">
          <SearchTags
            v-model="selectedCities"
            :options="cityOptions"
            label="Filtrar por ciudad"
          />
        </v-col>
      </v-row>

      <v-row v-if="pending">
        <v-col v-for="n in 6" :key="n" cols="12" md="6" lg="4">
          <v-card>
            <v-skeleton-loader type="article, actions"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>

      <div v-else-if="error">
        <v-alert type="error" variant="tonal">
          No se pudieron cargar los eventos públicos.
        </v-alert>
      </div>

      <v-row v-else>
        <v-col v-for="event in filteredEvents" :key="event.id" cols="12" md="6" lg="4">
          <EventTile :event="event" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
