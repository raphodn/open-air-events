<template>
  <h1 class="text-h5 font-weight-bold">Bienvenue sur CinéPleinAir</h1>

  <p>Découvrez les séances de cinéma en plein air près de chez vous.</p>
  <p>Gratuit et collaboratif. Vous pouvez ajouter les projections manquantes en quelques clics.</p>

  <br />

  <h2 class="text-h6 font-weight-bold">
    {{ eventsCount }} séances recensées
      <v-chip class="mb-1" size="small" color="primary" variant="tonal" label>{{ upcomingEvents.length }} à venir</v-chip>
  </h2>

  <v-btn :block="display.smAndDown.value" color="primary" to="/events">Trouver une séance</v-btn>

  <br />

  <h2 class="text-h6 font-weight-bold">Dernières séances ajoutées</h2>

  <v-row>
    <v-col v-for="event in recentlyAddedEvents" :key="event.id" cols="12" sm="6" md="4" xl="3">
      <EventCard :event="event" />
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import EventCard from '../components/EventCard.vue'
import { useEventsStore } from '../stores/events.js'

const eventsStore = useEventsStore()
const { events, eventsCount, upcomingEvents, pastEvents } = storeToRefs(eventsStore)
const display = useDisplay()

const recentlyAddedEvents = computed(() => {
  return [...events.value].sort((a, b) => new Date(b.properties.createdate).getTime() - new Date(a.properties.createdate).getTime()).slice(0, 4)
})
</script>

<style scoped>
</style>
