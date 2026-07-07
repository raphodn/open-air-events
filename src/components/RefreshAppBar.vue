<template>
  <v-app-bar v-if="isStale && !isRefreshAppBarDismissed" class="mb-4" color="secondary" variant="tonal" height="40" @click="refreshEvents">
    <v-app-bar-title class="text-body-2">
      <span v-if="!display.smAndDown.value">Dernière mise à jour {{ relativeLastSyncDate }}. Cliquez pour rafraîchir la liste.</span>
      <span v-else>Dernière màj {{ relativeLastSyncDate }}. Cliquez pour rafraîchir.</span>
    </v-app-bar-title>
    <v-btn icon="mdi-close" variant="text" @click.stop="dismissRefreshAppBar" aria-label="Fermer" />
  </v-app-bar>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useEventsStore } from '../stores/events.js'
import dateUtils from '../utils/date.js'

const eventsStore = useEventsStore()
const { isRefreshAppBarDismissed } = storeToRefs(eventsStore)
const display = useDisplay()
const now = ref(Date.now())
const hoursForStale = 24
let intervalId = null

const relativeLastSyncDate = computed(() => {
  now.value
  return eventsStore.eventsLastSyncDate
    ? dateUtils.formatRelativeTime(eventsStore.eventsLastSyncDate)
    : 'N/A'
})

// Determine if the events list is stale (older than 24 hours)
const isStale = computed(() => {
  if (!eventsStore.eventsLastSyncDate) return false
  const diffHours = (now.value - new Date(eventsStore.eventsLastSyncDate).getTime()) / 36e5
  return diffHours > hoursForStale
})

const dismissRefreshAppBar = () => {
  eventsStore.isRefreshAppBarDismissed = true
}

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
