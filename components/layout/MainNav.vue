<template>
  <v-app-bar color="#050507" flat>
    <v-container class="d-flex align-center">
      <v-toolbar-title>
        <NuxtLink to="/" class="logo-link">
          <img src="/images/logo.png" alt="Abrakdabra" class="logo" />
        </NuxtLink>
      </v-toolbar-title>

      <v-spacer />
      <template v-if="!isAuthenticated">
        <v-btn variant="outlined" size="small" to="/auth/register" class="text-caption mr-2">
          Registro
        </v-btn>
        <v-btn variant="outlined" size="small" to="/auth/login" class="text-caption">
          Login
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          v-if="role === 'admin' || role === 'gestor'"
          color="primary"
          variant="flat"
          size="small"
          class="text-caption mr-2"
          to="/admin"
        >
          Panel
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="outlined" size="small" class="text-caption">
              {{ user?.name || 'Perfil' }}
            </v-btn>
          </template>
          <v-list>
            <!-- Opciones para Admin/Gestor -->
            <v-list-item
              v-if="role === 'admin' || role === 'gestor'"
              @click="navigateTo('/admin/profile')"
            >
              <v-list-item-title>Editar perfil</v-list-item-title>
            </v-list-item>

            <!-- Opciones para Buyer -->
            <v-list-item
              v-if="role === 'buyer'"
              @click="navigateTo('/orders')"
            >
              <v-list-item-title>Mis tickets</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="role === 'buyer'"
              @click="navigateTo('/profile')"
            >
              <v-list-item-title>Editar perfil</v-list-item-title>
            </v-list-item>

            <!-- Común -->
            <v-list-item @click="logout().then(() => navigateTo('/'))">
              <v-list-item-title>Cerrar sesión</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
const { isAuthenticated, fetchMe, role, user, logout } = useAuth()

onMounted(() => {
  // Si hay token pero aún no hay usuario, intenta cargarlo
  fetchMe()
})
</script>

<style scoped lang="scss">
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}
</style>
