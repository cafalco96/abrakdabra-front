<script setup lang="ts">
const { role, isAuthenticated, user } = useAuth()

// Si ya está logueado, redirigimos
if (isAuthenticated.value) {
  if (role.value === 'admin' || role.value === 'gestor') {
    navigateTo('/admin')
  } else {
    navigateTo('/orders')
  }
}

const handleSuccess = async () => {
  // Esperar a que el estado reactivo se actualice
  await nextTick()
  
  if (role.value === 'admin' || role.value === 'gestor') {
    await navigateTo('/admin', { replace: true })
  } else {
    await navigateTo('/orders', { replace: true })
  }
}

definePageMeta({
  layout: 'default', // usa layout público con navbar/hero si quieres
})
</script>

<template>
  <v-container class="py-12">
    <v-row align="center" justify="center">
      <v-col cols="12" md="6" lg="4">
        <LoginForm
          title="Inicia sesión en Abrakdabra"
          subtitle="Accede a tu perfil y gestiona tus tickets."
          @success="handleSuccess"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
