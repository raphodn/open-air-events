<template>
  <v-app-bar v-if="isStale" class="mb-4" color="secondary" variant="tonal" height="40" style="cursor: pointer;" @click="refresh">
    <v-app-bar-title class="text-body-2">
      Dernière mise à jour {{ relativeLastSyncDate }}
    </v-app-bar-title>
    <v-btn icon="mdi-refresh" variant="text" aria-label="Rafraîchir" />
  </v-app-bar>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useEventsStore } from '../stores/events.js'
import dateUtils from '../utils/date.js'

const eventsStore = useEventsStore()
const now = ref(Date.now())
const hoursBeforeStale = 24
let intervalId = null

const relativeLastSyncDate = computed(() => {
  now.value
  return eventsStore.eventsLastSyncDate
    ? dateUtils.formatRelativeTime(eventsStore.eventsLastSyncDate)
    : 'N/A'
})

const isStale = computed(() => {
  if (!eventsStore.eventsLastSyncDate) return false
  const diffHours = (now.value - new Date(eventsStore.eventsLastSyncDate).getTime()) / 36e5
  return diffHours > hoursBeforeStale
})

const refresh = () => {
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
