<template>
  <v-card>
    <v-card-title>{{ event.properties.label }}</v-card-title>
    <v-card-text>
      <p>📅 {{ utils.formatDate(event.properties.start) }} ({{ utils.formatTime(event.properties.start) }})</p>
      <p>📍 {{ oedbService.eventLocationFullName(event) }}</p>
      <p>🔗 <a :href="event.properties.url" target="_blank">plus d'info</a></p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="text-caption text-grey-darken-1">
      Ajouté le {{ utils.formatDate(event.properties.createdate) }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { defineProps } from 'vue'
import utils from '../utils.js'
import oedbService from '../services/openeventdatabase.js'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})
</script>
