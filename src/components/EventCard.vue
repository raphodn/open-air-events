<template>
  <v-card :to="{ name: 'event-details', params: { id: event.properties.id } }" link>
    <v-card-title>{{ event.properties.label }}</v-card-title>
    <v-card-text>
      <p>📅 {{ dateUtils.formatDate(event.properties.start) }} ({{ dateUtils.formatTime(event.properties.start) }})</p>
      <p>📍 {{ oedbService.eventLocationFullName(event) }}</p>
      <p>🔗 <a :href="event.properties.url" target="_blank" @click.stop>plus d'info</a></p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="text-caption text-grey-darken-1">
      Ajouté le {{ dateUtils.formatDate(event.properties.createdate) }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'
import dateUtils from '../utils/date.js'
import oedbService from '../services/openeventdatabase.js'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>
