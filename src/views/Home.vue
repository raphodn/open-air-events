<template>
  <h1 class="text-h5 font-weight-bold">Bienvenue sur CinéPleinAir</h1>

  <p>Découvrez les événements de cinéma en plein air près de chez vous.</p>
  <p>Gratuit et collaboratif. Vous pouvez ajouter les projections manquantes en quelques clics.</p>

  <br />

  <h2 class="text-h6 font-weight-bold">{{ eventsCount }} événements recencés</h2>

  <v-btn color="primary" to="/events">Voir la liste</v-btn>
  <p>{{ upcomingEvents.length }} à venir. {{ pastEvents.length }} passés.</p>

  <br />

  <h2 class="text-h6 font-weight-bold">Derniers événements ajoutés</h2>

  <v-row>
    <v-col v-for="event in recentlyAddedEvents" :key="event.id" cols="12" sm="6" md="4" xl="3">
      <EventCard :event="event" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const upcomingEvents = computed(() => {
  const now = new Date()
  return events.value.filter(event => new Date(event.properties.start).getTime() > now.getTime())
})
const pastEvents = computed(() => {
  const now = new Date()
  return events.value.filter(event => new Date(event.properties.start).getTime() <= now.getTime())
})
const recentlyAddedEvents = computed(() => {
  return events.value.sort((a, b) => new Date(b.properties.createdate).getTime() - new Date(a.properties.createdate).getTime()).slice(0, 4)
})

onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
</style>
