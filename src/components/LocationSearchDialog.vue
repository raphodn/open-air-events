<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card title="Rechercher un lieu">
      <template #append>
        <v-icon icon="mdi-close" @click="closeDialog" />
      </template>

      <v-divider />

      <v-card-text>
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
        
        <LocationResult v-for="(result, index) in searchResults" :key="index" :location="result.properties" @click="selectLocation(result)" />
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
import { ref, watch } from 'vue'
import LocationResult from './LocationResult.vue'
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

const performLocationSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  openstreetmapService.photonSearch(searchQuery.value)
  .then(results => {
    searchResults.value = results
    console.log('Location search results:', results)
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