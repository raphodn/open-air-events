<template>
  <v-card>
    <v-card-title>{{ event.properties.label }}</v-card-title>
    <v-card-text>
      <p>📅 {{ formatDate(event.properties.start) }} ({{ formatTime(event.properties.start) }})</p>
      <p>📍 {{ getLocation(event) }}</p>
      <p>🔗 <a :href="event.properties.url" target="_blank">plus d'info</a></p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="text-caption text-grey-darken-1">
      Ajouté le {{ formatDate(event.properties.createdate) }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'
import { formatDate, formatTime } from '../utils.js'
import oedbService from '../services/openeventdatabase.js'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const getLocation = (event) => {
  return oedbService.eventLocationFullName(event)
}
</script>
