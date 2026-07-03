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
        <router-view v-else />
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useEventsStore } from './stores/events.js'

const eventsStore = useEventsStore()
const isPreloadingEvents = ref(true)

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
