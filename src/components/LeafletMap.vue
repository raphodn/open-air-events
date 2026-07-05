<template>
  <l-map ref="mapRef" v-model:zoom="mapZoom" :center="mapCenter" :use-global-leaflet="false" @ready="initMap">
    <l-tile-layer :url="tiles" layer-type="base" name="OpenStreetMap" :attribution="attribution" />
    <l-marker v-for="item in mapItems" :key="getMapItemKey(item)" :lat-lng="getMapItemLatLng(item)">
      <l-popup>
        <EventCard v-if="isEventsMode" :event="item" readonly />
        <LocationCard
          v-else
          :location="getLocationFromMapItem(item)"
          :show-actions="showActions"
          @select="locationSelected"
        />
      </l-popup>
    </l-marker>
  </l-map>
</template>

<script setup>
import 'leaflet/dist/leaflet.css'
import { computed, ref, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import { useTheme } from 'vuetify'
import EventCard from './EventCard.vue'
import LocationCard from './LocationCard.vue'
import geoUtils from '../utils/geo.js'

const props = defineProps({
  locations: {
    type: Array,
    default: () => []
  },
  events: {
    type: Array,
    default: () => []
  },
  showActions: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['locationSelected'])

const mapRef = ref(null)
const map = ref(null)
const mapZoom = ref(12)  // fitMapToBounds will override this if there are multiple locations
const mapCenter = ref([45, 5])
const mapBounds = ref(null)
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

const isEventsMode = computed(() => {
  return props.events.length > 0
})

const mapItems = computed(() => {
  if (isEventsMode.value) {
    return props.events
  }

  return props.locations
})

const mapLocations = computed(() => {
  return mapItems.value.map((item) => getLocationFromMapItem(item))
})

// Fit the map to the bounds of the locations
// If there is only one location, set the map view to that location with the default zoom
const fitMapToBounds = () => {
  if (map.value && mapBounds.value?.length) {
    if (mapLocations.value.length === 1) {
      map.value.setView(getLocationOSMLatLng(mapLocations.value[0]), mapZoom.value)
      return
    }

    map.value.fitBounds(mapBounds.value)
  }
}

watch(
  mapLocations,
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

function getLocationFromMapItem(item) {
  if (isEventsMode.value) {
    return item.properties
  }

  return item
}

function getMapItemKey(item) {
  if (isEventsMode.value && item.properties.id) {
    return `event-${item.properties.id}`
  }

  return getLocationOSMUniqueId(getLocationFromMapItem(item))
}

function getMapItemLatLng(item) {
  return getLocationOSMLatLng(getLocationFromMapItem(item))
}

const getLocationOSMUniqueId = (location) => {
  return geoUtils.getLocationOSMUniqueId(location)
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
