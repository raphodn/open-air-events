<template>
  <v-footer class="flex-grow-0 background-color-secondary-lighten-10">
    <v-row no-gutters>
      <v-col class="text-center">
        <p>
          {{ eventsStore.eventsCount }} séances.
          <br v-if="!display.smAndUp.value" />
          Dernière mise à jour {{ relativeLastSyncDate }}.
        </p>
        <v-btn class="mx-2 my-2" variant="text" prepend-icon="mdi-refresh" @click="refreshEvents">Rafraîchir</v-btn>
        <v-btn class="mx-2 my-2" variant="text" prepend-icon="mdi-information" :to="{ name: 'about' }">À propos</v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { useEventsStore } from '../stores/events.js'
import dateUtils from '../utils/date.js'

const eventsStore = useEventsStore()
const display = useDisplay()
const now = ref(Date.now())
let intervalId = null

const relativeLastSyncDate = computed(() => {
  now.value
  return eventsStore.eventsLastSyncDate
    ? dateUtils.formatRelativeTime(eventsStore.eventsLastSyncDate)
    : 'N/A'
})

const refreshEvents = () => {
  eventsStore.fetchEvents({ forceRefresh: true })
    .catch((error) => {
      console.error('Error refreshing events:', error)
    })
}

onMounted(() => {
  // Update the "now" value every 10 seconds to keep the relative time display accurate
  intervalId = window.setInterval(() => {
    now.value = Date.now()
  }, 1000 * 10)
})

onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId)
  }
})
</script>

<style scoped>
</style>
