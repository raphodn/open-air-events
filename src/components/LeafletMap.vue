<template>
  <l-map ref="mapRef" v-model:zoom="mapZoom" :center="mapCenter" :use-global-leaflet="false" @ready="initMap">
    <l-tile-layer :url="tiles" layer-type="base" name="OpenStreetMap" :attribution="attribution" />
    <l-marker v-for="location in locations" :key="getLocationOSMUniqueId(location)" :lat-lng="getLocationOSMLatLng(location)">
      <l-popup>
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
              @click="locationSelected(location)"
            >
              Selectionner
            </v-btn>
          </v-card-actions>
        </v-card>
      </l-popup>
    </l-marker>
  </l-map>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { computed, ref, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { useDisplay, useTheme } from 'vuetify'
import geoUtils from '../utils/geo.js'

const props = defineProps({
  locations: {
    type: Array,
    required: true
  },
  showActions: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['locationSelected'])

const mapRef = ref(null)
const map = ref(null)
const mapZoom = ref(5)
const mapCenter = ref([45, 5])
const mapBounds = ref(null)
const display = useDisplay()
const theme = useTheme()

const attributionBase = '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
const attribution = computed(() => {
  if (theme.global.name.value === 'dark') {
    return `${attributionBase}, &copy; <a href="https://carto.com/attributions">CARTO</a>`
  }
  return attributionBase
})

const tiles = computed(() => {
  if (theme.global.name.value === 'dark') {
    return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
  }
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
})

const fitMapToBounds = () => {
  if (map.value && mapBounds.value?.length) {
    map.value.fitBounds(mapBounds.value)
  }
}

watch(
  () => props.locations,
  (locations) => {
    mapBounds.value = geoUtils.getMapBounds(locations)
    fitMapToBounds()
  },
  { immediate: true }
)

const initMap = () => {
  map.value = mapRef.value?.leafletObject ?? null
  fitMapToBounds()
}

const getLocationTitle = (location, withName = true, withRoad = false, withCity = true) => {
  return geoUtils.getLocationOSMTitle(location, withName, withRoad, withCity)
}

const getLocationOSMUniqueId = (location) => {
  return geoUtils.getLocationOSMUniqueId(location)
}

const getLocationOSMTag = (location) => {
  return geoUtils.getLocationOSMTag(location)
}

const getLocationOSMLatLng = (location) => {
  return geoUtils.getLocationOSMLatLng(location)
}

const locationSelected = (location) => {
  emit('locationSelected', location)
}
</script>

<style>
.leaflet-popup-content {
  margin: 0;
}
.leaflet-popup-content-wrapper {
  padding: 0;
}
</style>
