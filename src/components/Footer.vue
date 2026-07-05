<template>
  <v-footer class="flex-grow-0" color="grey">
    <v-row no-gutters>
      <v-col class="text-center">
        <p>
          {{ eventsCount }} séances.
          <br v-if="!display.smAndUp.value" />
          Dernière mise à jour {{ relativeLastSyncDate }}.
        </p>
        <v-btn class="mx-2 my-2" variant="text" prepend-icon="mdi-refresh" @click="refreshEvents">Rafraîchir</v-btn>
        <v-btn class="mx-2 my-2" variant="text" prepend-icon="mdi-github" :href="constants.APP_GITHUB_URL" target="_blank">Github</v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import constants from '../constants'
import dateUtils from '../utils/date.js'
import { useEventsStore } from '../stores/events.js'

const eventsStore = useEventsStore()
const { eventsCount, eventsLastSyncDate } = storeToRefs(eventsStore)
const display = useDisplay()
const now = ref(Date.now())
let intervalId = null

const relativeLastSyncDate = computed(() => {
  now.value
  return eventsLastSyncDate.value
    ? dateUtils.formatRelativeTime(eventsLastSyncDate.value)
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
