<template>
  <v-alert type="info" variant="outlined" density="compact">
    La base de données utilisée est <a :href="constants.OEDB_WIKI_URL" target="_blank">OpenEventDatabase</a> (OEDB)
  </v-alert>

  <br />

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
import oedbService from '../services/openeventdatabase.js'
import EventForm from '../components/EventForm.vue'
import constants from '../constants'

const router = useRouter()

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
