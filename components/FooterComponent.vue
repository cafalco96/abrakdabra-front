<script setup lang="ts">
const currentYear = new Date().getFullYear()

const props = defineProps<{
  links?: { label: string; to: string }[]
}>()

const defaultLinks = [
  { label: 'Sobre Abrakdabra', to: '/about' },
  { label: 'Contacto', to: '/contact' },
  { label: 'Términos', to: '/terms' },
  { label: 'Privacidad', to: '/privacy' },
]

const navLinks = computed(() => props.links?.length ? props.links : defaultLinks)
</script>

<template>
  <v-footer
    class="app-footer"
    padless
  >
    <v-container class="py-6">
      <v-row align="start" justify="space-between" no-gutters>
        <!-- Marca -->
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <div class="footer-brand">
            <div class="footer-logo">Abrakdabra</div>
            <p class="footer-tagline">
              Hecho para la escena en vivo.
            </p>
          </div>
        </v-col>

        <!-- Links -->
        <v-col cols="12" md="4" class="mb-4 mb-md-0">
          <div class="footer-section-title">
            Navegación
          </div>
          <div class="footer-links">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="footer-link"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </v-col>

        <!-- Redes -->
        <v-col cols="12" md="4">
          <div class="footer-section-title">
            Conecta
          </div>
          <div class="footer-social">
            <v-btn
              icon="mdi-instagram"
              variant="text"
              size="small"
              class="footer-social-btn"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/abrakdabra.ec/"
            />
            <v-btn
              icon="mdi-facebook"
              variant="text"
              size="small"
              class="footer-social-btn"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/abrakdabra.ec"
            />
            <v-btn
              icon="mdi-whatsapp"
              variant="text"
              size="small"
              class="footer-social-btn"
              href="https://wa.me/+593996610024?text=Hola%20Abrakdabra%20Quiero%20más%20información%20sobre%20sus%20eventos."
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
          <p class="footer-note">
            Síguenos para enterarte de nuevos eventos y preventas exclusivas.
          </p>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="12" md="6" class="mb-2 mb-md-0">
          <span class="footer-copy">
            © {{ currentYear }} Abrakdabra. Todos los derechos reservados.
          </span>
        </v-col>
        <v-col cols="12" md="6" class="text-md-right">
          <span class="footer-made">
            Sitio desarrollado por <NuxtLink to="https://cafalco96.github.io" target="_blank" rel="noopener noreferrer">CF</NuxtLink>
          </span>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped lang="scss">
.app-footer {
  background: #050507;
  border-top: 1px solid rgba(148, 27, 52, 0.4);
  color: #9ca3af;
}

.footer-brand {
  max-width: 260px;
}

.footer-logo {
  font-family: 'Cinzel', system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: #f9fafb;
  margin-bottom: 8px;
}

.footer-tagline {
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
}

.footer-section-title {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #e5e7eb;
  margin-bottom: 8px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.footer-link {
  font-size: 0.85rem;
  color: #9ca3af;
  text-decoration: none;
}

.footer-link:hover {
  color: #f97373;
}

.footer-social {
  display: flex;
  gap: 4px;
  margin-bottom: 6px;
}

.footer-social-btn :deep(.v-icon) {
  color: #e5e7eb;
}

.footer-social-btn:hover :deep(.v-icon) {
  color: #f97373;
}

.footer-note {
  font-size: 0.8rem;
  margin: 0;
}

.footer-copy,
.footer-made {
  font-size: 0.78rem;
  color: #6b7280;
  a {
    text-decoration: underline;
    &:hover {
      color: #f97373;
    }
  }
}
</style>
