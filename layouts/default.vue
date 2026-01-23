<template>
  <v-app>
    <MainNav />

    <v-main>
      <v-container class="py-0 px-0">
        <slot />
      </v-container>
    </v-main>
    <FooterComponent />
  </v-app>
</template>

<script setup lang="ts">
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #0b0909;
  color: #f3f4f6;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.app-title {
  font-family: 'Cinzel', 'Inter', system-ui, sans-serif;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.section-title {
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.v-card {
  border-radius: 14px;
  border: 1px solid rgba(148, 27, 52, 0.3);
  background: radial-gradient(circle at top left, #1f1f24 0, #0b0909 60%);
}
</style>