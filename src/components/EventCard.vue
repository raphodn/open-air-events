<template>
  <v-card
    class="h-100 d-flex flex-column"
    :class="{ 'event-card--past': isPastEvent }"
    :to="{ name: 'event-details', params: { id: event.properties.id } }"
    link
  >
    <v-card-title :title="event.properties.label">{{ event.properties.label }}</v-card-title>
    <v-card-text class="flex-grow-1">
      <p class="d-flex align-center ga-2">
        <span>📅 {{ dateUtils.formatDate(event.properties.start) }} à {{ dateUtils.formatTime(event.properties.start) }}</span>
        <v-chip v-if="isTodayEvent" size="x-small" color="primary" variant="tonal" label>Aujourd'hui</v-chip>
        <v-chip v-else-if="isPastEvent" size="x-small" color="grey" variant="flat" label>Passé</v-chip>
      </p>
      <p>📍 {{ oedbService.eventLocationFullName(event) }}</p>
      <p>🔗 <a :href="event.properties.url" target="_blank" @click.stop>plus d'info</a></p>
      <p v-if="event.properties.tags">
        <span class="chip-group">
          <span>🏷</span>
          <v-chip v-for="tag in event.properties.tags" :key="tag" size="x-small" variant="tonal" label>{{ tag }}</v-chip>
        </span>
      </p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="text-caption text-grey-darken-1" style="max-height:50px;">
      Ajouté le {{ dateUtils.formatDate(event.properties.createdate) }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import dateUtils from '../utils/date.js'
import oedbService from '../services/openeventdatabase.js'

const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const isPastEvent = computed(() => {
  return dateUtils.dateIsInThePast(props.event.properties.start)
})

const isTodayEvent = computed(() => {
  return dateUtils.dateIsToday(props.event.properties.start)
})
</script>

<style scoped>
.event-card--past {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
}
</style>
