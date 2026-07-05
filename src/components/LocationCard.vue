<template>
  <v-card>
    <v-card-title>
      {{ getLocationTitle(location, true, false, false) }}
    </v-card-title>
    <v-card-subtitle>
      {{ getLocationTitle(location, false, true, true) }}<br>
    </v-card-subtitle>
    <v-card-text>
      <v-chip label size="small" density="comfortable">
        {{ getLocationOSMTag(location) }}
      </v-chip>
    </v-card-text>
    <v-card-actions v-if="showActions">
      <v-btn
        block
        color="primary"
        variant="flat"
        :block="!display.smAndUp.value"
        @click="selectLocation"
      >
        Selectionner
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import geoUtils from '../utils/geo.js'

const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select'])
const display = useDisplay()

const getLocationTitle = (location, withName = true, withRoad = false, withCity = true) => {
  return geoUtils.getLocationOSMTitle(location, withName, withRoad, withCity)
}

const getLocationOSMTag = (location) => {
  return geoUtils.getLocationOSMTag(location)
}

const selectLocation = () => {
  emit('select', props.location)
}
</script>
