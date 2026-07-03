<template>
  <v-row>
    <v-col cols="12">
      <v-switch
        v-model="includePast"
        color="primary"
        density="compact"
        hide-details
        label="Afficher les événements passés"
      />
    </v-col>
  </v-row>

  <v-row class="mt-0">
    <v-col v-for="event in displayedEvents" :key="event.properties.id" cols="12" sm="6" md="4" xl="3">
      <EventCard :event="event" />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-btn color="primary" to="/events/create">Ajouter un événement manquant</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import EventCard from '../components/EventCard.vue'
import { useEventsStore } from '../stores/events.js'

const eventsStore = useEventsStore()
const { events } = storeToRefs(eventsStore)
const includePast = ref(false)

const displayedEvents = computed(() => {
  if (includePast.value) {
    return events.value
  }

  const now = new Date().getTime()
  return events.value.filter(event => new Date(event.properties.start).getTime() > now)
})
</script>
