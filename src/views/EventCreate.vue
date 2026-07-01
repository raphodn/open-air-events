<template>
  <h1>Créer un événement</h1>

  <p>ℹ️ la base de données utilisée est <a href="https://wiki.openstreetmap.org/wiki/OpenEventDatabase" target="_blank">OpenEventDatabase</a> (<i>culture.cinema.outdoor</i>)</p>

  <br />

  <v-form @submit.prevent="createEvent">

    <h2>1. Informations</h2>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="eventForm.label"
          label="Nom de l'événement *"
          :rules="[rules.required]"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="eventForm.url"
          label="URL de l'événement *"
          :rules="[rules.required, rules.url]"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="eventForm.start"
          label="Date et heure de début *"
          type="datetime-local"
          :rules="[rules.required, rules.dateTimeFormat]"
          required
        ></v-text-field>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-text-field
          v-model="eventForm.stop"
          label="Date et heure de fin *"
          type="datetime-local"
          :rules="[rules.required, rules.dateTimeFormat, rules.endTimeAfterStart]"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <h2>2. Lieu</h2>
    
    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          variant="outlined"
          @click="openLocationDialog"
          prepend-icon="mdi-map-marker"
        >
          Rechercher
        </v-btn>
        <LocationResult v-if="eventForm.location" class="mt-4" :location="eventForm.location.properties" />
        <v-alert v-else class="mt-4" type="warning" variant="outlined" density="compact">Aucun lieu sélectionné</v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn
          color="primary"
          type="submit"
          :disabled="!eventFormFilled"
          :loading="isSubmitting"
        >
          Créer l'événement
        </v-btn>
        <v-btn
          variant="text"
          to="/events"
          class="ml-2"
        >
          Annuler
        </v-btn>
      </v-col>
    </v-row>
  </v-form>

  <LocationSearchDialog
    v-model="showLocationDialog"
    @location-selected="selectLocation"
  />
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import oedbService from '../services/openeventdatabase.js'
import openstreetmapService from '../services/openstreetmap.js'
import LocationSearchDialog from '../components/LocationSearchDialog.vue'
import LocationResult from '../components/LocationResult.vue'
import { formatDateTimeWithTZ } from '../utils.js'

const router = useRouter()

// Init the form data
const eventForm = ref({
  label: '',
  url: '',
  start: '',
  stop: '',
  location: '',
})

// Form validation state
const isSubmitting = ref(false)

// Location dialog state
const showLocationDialog = ref(false)

// Define validation rules
const rules = reactive({
  required: (value) => !!value || 'Ce champ est requis',
  url: (value) => {
    if (!value) return true // Allow empty URLs
    const pattern = /^https?:\/\/.+/i
    return pattern.test(value) || 'URL invalide'
  },
  dateTimeFormat: (value) => {
    if (!value) return 'Date/heure requise'
    const date = new Date(value)
    return !isNaN(date.getTime()) || 'Format date/heure invalide'
  },
  endTimeAfterStart: (value) => {
    if (!value) return 'Date/heure requise'
    const startDate = new Date(eventForm.value.start)
    const endDate = new Date(value)
    return endDate > startDate || 'La date de fin doit être après la date de début'
  }
})

const eventFormFilled = computed(() => {
  return eventForm.value.label && eventForm.value.url && eventForm.value.start && eventForm.value.stop && eventForm.value.location
})

// Location selection
const openLocationDialog = () => {
  showLocationDialog.value = true
}
const selectLocation = (location) => {
  eventForm.value.location = location
}

// Function to create event
const createEvent = async () => {
  if (!eventFormFilled.value) {
    alert('Veuillez corriger les erreurs avant de soumettre.')
    return
  }

  isSubmitting.value = true

  const eventStartStopWithTZ = {
    start: formatDateTimeWithTZ(eventForm.value.start),
    stop: formatDateTimeWithTZ(eventForm.value.stop)
  }
  const eventLocation = openstreetmapService.photonLocationToEventLocation(eventForm.value.location)
  let eventData = {...eventForm.value, ...eventStartStopWithTZ, ...eventLocation}
  delete eventData.location // Remove the original location object
  oedbService.createEvent(eventData)
    .then(response => {
      alert('Événement créé avec succès !')
      router.push('/events')
    })
    .catch(error => {
      console.error('Erreur lors de la création de l\'événement:', error)
      alert('Erreur lors de la création de l\'événement.')
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>
