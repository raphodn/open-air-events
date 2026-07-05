<template>
  <EventForm
    :initial-form="initialForm"
    :is-submitting="isSubmitting"
    submit-label="Ajouter"
    @submit="createEvent"
    @cancel="router.push('/events')"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '../composables/useSnackbar.js'
import oedbService from '../services/openeventdatabase.js'
import EventForm from '../components/EventForm.vue'
import constants from '../constants'

const router = useRouter()
const { showSuccess, showError } = useSnackbar()

const initialForm = ref({
  what: constants.OEDB_WHAT_LIST[0].key,  // 'culture.cinema.outdoor'
  label: '',
  tags: [],
  url: '',
  start: '',
  location: '',
})

const isSubmitting = ref(false)

// Function to create event
const createEvent = (eventForm) => {
  isSubmitting.value = true

  oedbService.createEvent(eventForm)
    .then(response => {
      console.log("Séance créée avec succès:", response)
      showSuccess('Séance créée avec succès !')
      // Refresh the store to include the new event
      return eventsStore.fetchEvents({ forceRefresh: true })
    })
    .then(() => {
      router.push('/events')
    })
    .catch(error => {
      console.error("Erreur lors de la création de la séance:", error)
      showError("Erreur lors de la création de la séance.")
    })
    .finally(() => {
      isSubmitting.value = false
    })
}
</script>
