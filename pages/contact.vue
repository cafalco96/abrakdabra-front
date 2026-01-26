<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const contactInfo = {
  address: 'Retro Lens Optical, Quito, Ecuador',
  phone: '+593 2 1234567',
  email: 'soporte@abrakdabra.ec',
  whatsapp: '+593 99 1234567',
  addressMapUrl: 'https://www.google.com/maps/place/RETRO+LENS+OPTICAL/data=!4m2!3m1!1s0x0:0x370ea4914633e107',
  whatsappUrl: 'https://wa.me/593991234567?text=Hola%20Abrakdabra,%20tengo%20una%20consulta',
}
</script>

<template>
  <v-container class="py-12" max-width="1000">
    <h1 class="text-h4 mb-2">
      Contacto
    </h1>
    <p class="text-body-2 text-medium-emphasis mb-8">
      ¿Tienes preguntas? Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
    </p>

    <v-row>
      <!-- Información de Contacto -->
      <v-col cols="12" md="6">
        <v-card variant="flat" class="h-100">
          <v-card-text>
            <!-- Dirección -->
            <div class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon class="mr-3" color="primary">
                  mdi-map-marker
                </v-icon>
                <h3 class="text-subtitle-1">
                  Dirección
                </h3>
              </div>
              <a
                :href="contactInfo.addressMapUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary text-decoration-none hover-underline"
              >
                {{ contactInfo.address }}
              </a>
            </div>

            <!-- Teléfono -->
            <div class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon class="mr-3" color="primary">
                  mdi-phone
                </v-icon>
                <h3 class="text-subtitle-1">
                  Teléfono
                </h3>
              </div>
              <a
                :href="`tel:${contactInfo.phone.replace(/\s/g, '')}`"
                class="text-primary text-decoration-none hover-underline"
              >
                {{ contactInfo.phone }}
              </a>
            </div>

            <!-- Correo -->
            <div class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon class="mr-3" color="primary">
                  mdi-email
                </v-icon>
                <h3 class="text-subtitle-1">
                  Correo
                </h3>
              </div>
              <a
                :href="`mailto:${contactInfo.email}`"
                class="text-primary text-decoration-none hover-underline"
              >
                {{ contactInfo.email }}
              </a>
            </div>

            <!-- WhatsApp -->
            <div class="mb-6">
              <div class="d-flex align-center mb-2">
                <v-icon class="mr-3" color="primary">
                  mdi-whatsapp
                </v-icon>
                <h3 class="text-subtitle-1">
                  WhatsApp
                </h3>
              </div>
              <a
                :href="contactInfo.whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary text-decoration-none hover-underline"
              >
                {{ contactInfo.whatsapp }}
              </a>
            </div>

            <!-- Horario de Atención -->
            <div>
              <div class="d-flex align-center mb-2">
                <v-icon class="mr-3" color="primary">
                  mdi-clock
                </v-icon>
                <h3 class="text-subtitle-1">
                  Horario de Atención
                </h3>
              </div>
              <p class="text-body-2 mb-1">
                <strong>Lunes a Viernes:</strong> 9:00 - 18:00
              </p>
              <p class="text-body-2">
                <strong>Sábado y Domingo:</strong> 10:00 - 16:00
              </p>
              <p class="text-caption text-medium-emphasis mt-2">
                Hora de Quito (UTC-5)
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Ubicación en Mapa -->
      <v-col cols="12" md="6">
        <v-card variant="flat" class="h-100">
          <v-card-title>
            Ubicación
          </v-card-title>
          <v-card-text>
            <iframe
              width="100%"
              height="400"
              frameborder="0"
              style="border: 0; border-radius: 8px;"
              src="https://maps.google.com/maps?q=RETRO+LENS+OPTICAL,Quito,Ecuador&t=&z=15&ie=UTF8&iwloc=&output=embed"
              allowfullscreen=""
              aria-hidden="false"
              tabindex="0"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div class="text-center mt-8">
      <NuxtLink to="/" class="text-primary">
        Volver al inicio
      </NuxtLink>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.hover-underline:hover {
  text-decoration: underline;
}
</style>
