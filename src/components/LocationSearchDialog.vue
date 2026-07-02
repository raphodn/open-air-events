<template>
  <v-dialog v-model="dialogVisible" scrollable :height="dialogHeight" :width="dialogWidth">
    <v-card title="Rechercher un lieu">
      <template #append>
        <v-icon icon="mdi-close" @click="closeDialog" />
      </template>

      <v-divider />

      <v-card-text>
        <v-form class="mb-4" @submit.prevent="performLocationSearch">
          <v-text-field
            v-model="searchQuery"
            label="Entrez une adresse ou un nom de lieu"
            autofocus
            @keyup.enter="performLocationSearch"
            :loading="isSearching"
          >
            <template #append-inner>
              <v-btn color="primary" icon="mdi-magnify" :disabled="!searchQuery" @click="performLocationSearch" />
            </template>
          </v-text-field>
        </v-form>
        
        <v-row>
          <v-col cols="12" sm="6">
            <LocationResult v-for="(result, index) in searchResults" :key="index" :location="result.properties" @click="selectLocation(result)" />
          </v-col>
          <v-col cols="12" sm="6" style="min-height:400px">
            <LeafletMap :locations="searchResults" :showActions="true" @locationSelected="selectLocation" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />
      
      <v-card-actions class="justify-end">
        <div>
          grâce à <a href="https://photon.komoot.io/" target="_blank">Komoot Photon (OpenStreetMap)</a>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import LocationResult from './LocationResult.vue'
import LeafletMap from './LeafletMap.vue'
import openstreetmapService from '../services/openstreetmap.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'location-selected'])

const dialogVisible = ref(props.modelValue)
const searchQuery = ref('')
const searchResults = ref([])
const isSearching = ref(false)
const display = useDisplay()

// Watch for changes to the modelValue prop
watch(() => props.modelValue, (newValue) => {
  dialogVisible.value = newValue
  if (!newValue) {
    searchQuery.value = ''
    searchResults.value = []
  } else {
    searchResults.value = []
  }
})

// Watch for changes to dialog visibility
watch(dialogVisible, (newValue) => {
  if (!newValue) {
    emit('update:modelValue', false)
  }
})

const dialogHeight = computed(() => {
  return display.smAndUp.value ? '80%' : '100%'
})
const dialogWidth = computed(() => {
  return display.smAndUp.value ? '80%' : '100%'
})

const performLocationSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  openstreetmapService.photonSearch(searchQuery.value)
  .then(results => {
    searchResults.value = results
  })
  .catch(error => {
    console.error('Error searching for location:', error)
    searchResults.value = []
    alert('Erreur lors de la recherche d\'adresse.')
  })
  .finally(() => {
    isSearching.value = false
  })
}

const getLocationName = (location) => {
  return location.properties.name || location.properties.street || location.properties.display_name || 'Adresse inconnue'
}

const getLocationAddress = (location) => {
  const props = location.properties
  
  // Try to build a readable address from available properties
  const addrParts = []
  
  // Add house number if available
  if (props.housenumber) addrParts.push(props.housenumber)
  
  // Add street name if available
  if (props.street) addrParts.push(props.street)
  
  // Add other address components
  if (props.city || props.town || props.village) {
    addrParts.push(props.city || props.town || props.village)
  }
  if (props.postcode) addrParts.push(props.postcode)
  if (props.country) addrParts.push(props.country)
  
  return addrParts.join(', ')
}

const selectLocation = (location) => {
  emit('location-selected', location)
  closeDialog()
}

const closeDialog = () => {
  dialogVisible.value = false
  emit('update:modelValue', false)
  searchQuery.value = ''
  searchResults.value = []
}

defineExpose({
  performLocationSearch,
  closeDialog
})
</script>