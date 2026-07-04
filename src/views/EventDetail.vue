<template>
  <v-row>
    <v-col cols="12" md="6">
      <EventCard :event="event" readonly />
    </v-col>
    <v-col cols="12" md="6" style="min-height:400px">
      <LeafletMap :locations="[event.properties]" :showActions="false" />
    </v-col>
  </v-row>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useEventsStore } from '../stores/events.js'
import EventCard from '../components/EventCard.vue'
import LeafletMap from '../components/LeafletMap.vue'

const route = useRoute()
const eventId = route.params.id
const eventsStore = useEventsStore()
const event = eventsStore.getEventById(eventId)
</script>

<style scoped>
</style>
