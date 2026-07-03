<template>
  <h1 class="text-h5 font-weight-bold">
    Tous les événements
    <small>{{ eventsCount }}</small>
  </h1>

  <v-row>
    <v-col v-for="event in events" :key="event.id" cols="12" sm="6" md="4" xl="3">
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
import { storeToRefs } from 'pinia'
import EventCard from '../components/EventCard.vue'
import { useEventsStore } from '../stores/events.js'

const eventsStore = useEventsStore()
const { events, eventsCount } = storeToRefs(eventsStore)
</script>
