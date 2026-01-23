<script setup lang="ts">
const drawer = ref(true)
const { user, role, logout } = useAuth()

const adminNav = [
  { label: 'Resumen', icon: 'mdi-view-dashboard-outline', to: '/admin' },
  { label: 'Eventos', icon: 'mdi-calendar-multiple', to: '/admin/events' },
  { label: 'Cupones', icon: 'mdi-tag-outline', to: '/admin/discount-codes' },
  { label: 'Órdenes', icon: 'mdi-ticket-confirmation-outline', to: '/admin/orders' },
  { label: 'Usuarios', icon: 'mdi-account-multiple-outline', to: '/admin/users' },
]

const navigationItems = computed(() =>
  role.value === 'admin'
    ? adminNav
    : adminNav.filter((item) => item.label !== 'Gestores')
)
</script>

<template>
  <v-app>
    <v-app-bar color="surface" flat>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />

      <v-toolbar-title class="text-subtitle-1 text-uppercase">
        Abrakdabra · Panel
      </v-toolbar-title>

      <v-spacer />

      <v-chip size="small" color="primary" variant="tonal" class="mr-2">
        {{ role === 'admin' ? 'Admin' : 'Gestor' }}
      </v-chip>

      <v-menu>
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="text" size="small">
            {{ user?.name }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="navigateTo('/admin/profile')">
            <v-list-item-title>Editar perfil</v-list-item-title>
          </v-list-item>

          <v-list-item @click="logout().then(() => navigateTo('/'))">
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      color="surface"
      width="240"
      app
    >
      <v-list density="comfortable" nav>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.to"
          :to="item.to"
          rounded="lg"
        >
          <template #prepend>
            <v-icon :icon="item.icon" />
          </template>
          <v-list-item-title>
            {{ item.label }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <v-divider class="my-2" />

      <v-list density="comfortable" nav>
        <v-list-item
          to="/"
          rounded="lg"
        >
          <template #prepend>
            <v-icon icon="mdi-home-outline" />
          </template>
          <v-list-item-title>
            Ir al inicio
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="py-6 px-4 px-md-8">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
