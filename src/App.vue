<template>
  <v-app>
    <Header />

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import oedbService from './services/openeventdatabase.js'

const preloadEvents = () => {
  oedbService.getEvents()
    .catch((error) => {
      console.error('Error preloading events on app startup:', error)
    })
}

onMounted(() => {
  preloadEvents()
})
</script>

<style scoped>
</style>
