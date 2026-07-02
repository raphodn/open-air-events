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
import { ref, onMounted } from 'vue'
import EventCard from '../components/EventCard.vue'
import oedbService from '../services/openeventdatabase.js'

const events = ref([])
const eventsCount = ref(0)

const loadEvents = () => {
  oedbService.getEvents()
    .then(data => {
      events.value = data.features
      eventsCount.value = data.count
    })
    .catch(error => {
      console.error('Error loading events:', error)
    })
}

onMounted(() => {
  loadEvents()
})
</script>
