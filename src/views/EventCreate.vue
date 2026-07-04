<template>
  <v-alert type="info" variant="outlined" density="compact">
    La base de données utilisée est <a :href="constants.OEDB_WIKI_URL" target="_blank">OpenEventDatabase</a> (OEDB)
  </v-alert>

  <br />

  <v-form @submit.prevent="createEvent">

    <h2 class="text-subtitle-1 font-weight-bold">Type</h2>

    <v-row>
      <v-col cols="12">
        <v-select
          class="pl-4"
          variant="plain"
          density="compact"
          v-model="eventForm.what"
          :items="constants.OEDB_WHAT_LIST"
          item-value="key"
          item-title="label"
          :rules="[rules.required]"
          required
          readonly
        ></v-select>
      </v-col>
    </v-row>

    <h2 class="text-subtitle-1 font-weight-bold">Informations</h2>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="eventForm.label"
          label="Nom de l'événement *"
          hide-details="auto"
          :rules="[rules.required]"
          required
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="eventForm.url"
          label="Lien vers l'événement *"
          hint="https://www.example.com"
          persistent-hint
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
    </v-row>

    <h2 class="text-subtitle-1 font-weight-bold">Lieu</h2>
    
    <v-row>
      <v-col cols="12">
        <v-btn
          size="small"
          color="primary"
          variant="outlined"
          @click="openLocationDialog"
          prepend-icon="mdi-magnify"
        >
          Rechercher
        </v-btn>
        <LocationResult v-if="eventForm.location" class="mt-4" :location="eventForm.location.properties" />
        <p v-else class="text-error">Aucun lieu sélectionné</p>
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
          Ajouter
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
import LocationSearchDialog from '../components/LocationSearchDialog.vue'
import LocationResult from '../components/LocationResult.vue'
import constants from '../constants'

const router = useRouter()

// Init the form data
const eventForm = ref({
  what: constants.OEDB_WHAT_LIST[0].key,  // 'culture.cinema.outdoor'
  label: '',
  url: '',
  start: '',
  // stop: '',  // will be automatically set to +2 hours
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
  const requiredFields = ['what', 'label', 'url', 'start', 'location']
  return requiredFields.every(field => !!eventForm.value[field])
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

  // create the event
  oedbService.createEvent(eventForm.value)
    .then(response => {
      console.log("Événement créé avec succès:", response)
      alert('Événement créé avec succès !')
      router.push('/events')
    })
    .catch(error => {
      console.error("Erreur lors de la création de l'événement:", error)
      alert("Erreur lors de la création de l'événement.")
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>
