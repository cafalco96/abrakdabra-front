<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <v-container class="py-12" max-width="1000">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-h3 mb-4">
        Sobre Abrakdabra
      </h1>
      <p class="text-h6 text-medium-emphasis">
        Tu plataforma de confianza para vivir experiencias inolvidables
      </p>
    </div>

    <!-- Quiénes Somos -->
    <v-row class="mb-12">
      <v-col cols="12">
        <v-card variant="flat">
          <v-card-text class="pa-8">
            <h2 class="text-h5 mb-4">
              ¿Quiénes Somos?
            </h2>
            <p class="text-body-1 mb-4" style="line-height: 1.8;">
              Abrakdabra es la plataforma líder en venta de entradas para eventos en Ecuador. 
              Conectamos a miles de personas con sus experiencias favoritas: conciertos, eventos deportivos, 
              obras de teatro, festivales y mucho más.
            </p>
            <p class="text-body-1" style="line-height: 1.8;">
              Desde nuestro inicio, hemos trabajado para ofrecer una experiencia de compra simple, 
              segura y accesible para todos. Creemos que cada evento es una oportunidad para crear 
              recuerdos únicos, y estamos comprometidos en hacer que acceder a ellos sea fácil y confiable.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Misión y Visión -->
    <v-row class="mb-12">
      <v-col cols="12" md="6">
        <v-card variant="flat" class="h-100">
          <v-card-text class="pa-8">
            <div class="d-flex align-center mb-4">
              <v-icon size="48" color="primary" class="mr-4">
                mdi-target
              </v-icon>
              <h2 class="text-h5">
                Nuestra Misión
              </h2>
            </div>
            <p class="text-body-1" style="line-height: 1.8;">
              Facilitar el acceso a experiencias culturales, deportivas y de entretenimiento 
              a través de una plataforma innovadora, segura y accesible para todos los ecuatorianos, 
              conectando a las personas con los momentos que aman.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="flat" class="h-100">
          <v-card-text class="pa-8">
            <div class="d-flex align-center mb-4">
              <v-icon size="48" color="primary" class="mr-4">
                mdi-eye
              </v-icon>
              <h2 class="text-h5">
                Nuestra Visión
              </h2>
            </div>
            <p class="text-body-1" style="line-height: 1.8;">
              Ser la plataforma de venta de entradas más confiable y utilizada en Ecuador, 
              reconocida por nuestra tecnología, servicio al cliente excepcional y compromiso 
              con la cultura y el entretenimiento del país.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Valores -->
    <v-row class="mb-12">
      <v-col cols="12">
        <h2 class="text-h5 mb-6 text-center">
          Nuestros Valores
        </h2>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" class="text-center h-100">
          <v-card-text class="pa-6">
            <v-icon size="56" color="primary" class="mb-4">
              mdi-shield-check
            </v-icon>
            <h3 class="text-h6 mb-3">
              Confianza
            </h3>
            <p class="text-body-2">
              Garantizamos transacciones seguras y protegemos los datos de nuestros usuarios 
              con los más altos estándares de seguridad.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" class="text-center h-100">
          <v-card-text class="pa-6">
            <v-icon size="56" color="primary" class="mb-4">
              mdi-lightning-bolt
            </v-icon>
            <h3 class="text-h6 mb-3">
              Innovación
            </h3>
            <p class="text-body-2">
              Utilizamos tecnología de punta para ofrecer una experiencia de compra 
              rápida, intuitiva y moderna.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" class="text-center h-100">
          <v-card-text class="pa-6">
            <v-icon size="56" color="primary" class="mb-4">
              mdi-account-group
            </v-icon>
            <h3 class="text-h6 mb-3">
              Accesibilidad
            </h3>
            <p class="text-body-2">
              Creemos que todos merecen acceso a experiencias increíbles. 
              Facilitamos la compra para cualquier persona, en cualquier lugar.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" class="text-center h-100">
          <v-card-text class="pa-6">
            <v-icon size="56" color="primary" class="mb-4">
              mdi-heart
            </v-icon>
            <h3 class="text-h6 mb-3">
              Pasión
            </h3>
            <p class="text-body-2">
              Amamos lo que hacemos y trabajamos con pasión para conectar a las personas 
              con las experiencias que disfrutan.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" class="text-center h-100">
          <v-card-text class="pa-6">
            <v-icon size="56" color="primary" class="mb-4">
              mdi-star
            </v-icon>
            <h3 class="text-h6 mb-3">
              Excelencia
            </h3>
            <p class="text-body-2">
              Nos comprometemos con la calidad en cada aspecto de nuestro servicio, 
              desde la compra hasta el evento.
            </p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="flat" class="text-center h-100">
          <v-card-text class="pa-6">
            <v-icon size="56" color="primary" class="mb-4">
              mdi-handshake
            </v-icon>
            <h3 class="text-h6 mb-3">
              Compromiso
            </h3>
            <p class="text-body-2">
              Estamos comprometidos con nuestros usuarios, organizadores y la comunidad 
              cultural de Ecuador.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Por Qué Elegirnos -->
    <v-row class="mb-12">
      <v-col cols="12">
        <v-card variant="flat" color="primary" dark>
          <v-card-text class="pa-8">
            <h2 class="text-h5 mb-6 text-center">
              ¿Por Qué Elegir Abrakdabra?
            </h2>
            <v-row>
              <v-col cols="12" md="3" class="text-center">
                <div class="text-h3 mb-2">
                  100%
                </div>
                <div class="text-body-2">
                  Seguro y Confiable
                </div>
              </v-col>
              <v-col cols="12" md="3" class="text-center">
                <div class="text-h3 mb-2">
                  24/7
                </div>
                <div class="text-body-2">
                  Acceso en Línea
                </div>
              </v-col>
              <v-col cols="12" md="3" class="text-center">
                <div class="text-h3 mb-2">
                  +20
                </div>
                <div class="text-body-2">
                  Eventos regulares 
                </div>
              </v-col>
              <v-col cols="12" md="3" class="text-center">
                <div class="text-h3 mb-2">
                  Tickets
                </div>
                <div class="text-body-2">
                  Digitales Instantáneos
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- CTA -->
    <div class="text-center">
      <h2 class="text-h5 mb-4">
        ¿Listo para tu próxima experiencia?
      </h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Descubre los mejores eventos en Ecuador y compra tus entradas ahora.
      </p>
      <v-btn color="primary" size="large" to="/">
        Explorar Eventos
      </v-btn>
    </div>
  </v-container>
</template>

<style scoped lang="scss">
.v-card {
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-4px);
  }
}
</style>
