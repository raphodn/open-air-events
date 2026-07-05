<template>
  <v-app>
    <Header />

    <v-main>
      <v-container>
        <v-row v-if="isPreloadingEvents">
          <v-col align="center">
            <v-progress-circular indeterminate color="primary" />
          </v-col>
        </v-row>
        <template v-else>
          <Breadcrumbs />
          <router-view />
        </template>
      </v-container>
    </v-main>

    <Footer />

    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useSnackbar } from './composables/useSnackbar.js'
import Header from './components/Header.vue'
import Breadcrumbs from './components/Breadcrumbs.vue'
import Footer from './components/Footer.vue'
import { useEventsStore } from './stores/events.js'

const eventsStore = useEventsStore()
const isPreloadingEvents = ref(true)
const { showSnackbar, snackbarMessage, snackbarColor } = useSnackbar()

const preloadEvents = () => {
  eventsStore.fetchEvents()
    .catch((error) => {
      console.error('Error preloading events on app startup:', error)
    })
    .finally(() => {
      isPreloadingEvents.value = false
    })
}

onMounted(() => {
  preloadEvents()
})
</script>

<style scoped>
</style>
