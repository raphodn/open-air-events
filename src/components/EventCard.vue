<template>
  <v-card
    class="h-100 d-flex flex-column border-secondary"
    :class="{ 'background-color-secondary-lighten-5': isPastEvent }"
    :to="cardTo"
    :link="!props.readonly"
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
      <p v-if="event.properties.tags && event.properties.tags.length > 0">
        <span class="chip-group">
          <span>🏷</span>
          <v-chip v-for="tag in event.properties.tags" :key="tag" size="x-small" variant="tonal" label>{{ tag }}</v-chip>
        </span>
      </p>
    </v-card-text>
    <v-divider v-if="props.showActionButton || props.showFooter"></v-divider>
    <v-card-text v-if="props.showActionButton">
      <v-btn :block="display.smAndDown.value" color="primary" size="small" :to="detailsTo" link>Détails</v-btn>
    </v-card-text>
    <v-card-text v-else-if="props.showFooter" class="text-caption text-grey-darken-1" style="max-height:50px;">
      Ajouté le {{ dateUtils.formatDate(event.properties.createdate) }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useDisplay } from 'vuetify'
import dateUtils from '../utils/date.js'
import oedbService from '../services/openeventdatabase.js'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  showActionButton: {
    type: Boolean,
    default: false
  },
  showFooter: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const display = useDisplay()

const detailsTo = computed(() => {
  return { name: 'event-details', params: { id: props.event.properties.id } }
})

const cardTo = computed(() => {
  if (props.readonly) {
    return undefined
  }

  return detailsTo.value
})

const isPastEvent = computed(() => {
  return dateUtils.dateIsInThePast(props.event.properties.start)
})

const isTodayEvent = computed(() => {
  return dateUtils.dateIsToday(props.event.properties.start)
})
</script>

<style scoped>
</style>
