<template>
  <v-card v-if="location" variant="outlined" class="pa-3 mb-3">
    <div class="font-weight-medium">{{ photonLocationFullName }}</div>
    <v-chip class="mr-1" label size="small">{{ photonLocationType }}</v-chip>
    <v-chip label size="small">{{ photonLocationID }}</v-chip>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import osmService from '../services/openstreetmap.js'

const props = defineProps({
  location: {
    type: Object,
    required: true
  },
})

const photonLocationFullName = computed(() => {
  return osmService.photonLocationFullName(props.location)
})
const photonLocationType = computed(() => {
  return osmService.photonLocationType(props.location)
})
const photonLocationID = computed(() => {
  return osmService.photonLocationID(props.location)
})
</script>
