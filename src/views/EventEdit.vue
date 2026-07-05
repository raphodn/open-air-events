<template>
  <v-progress-linear
    v-if="isLoading"
    indeterminate
    color="primary"
    class="mb-4"
  ></v-progress-linear>

  <EventForm
    v-else-if="initialForm"
    :initial-form="initialForm"
    :is-submitting="isSubmitting"
    :current-event-id="eventId"
    submit-label="Enregistrer"
    @submit="updateEvent"
    @cancel="router.push(`/events/${eventId}`)"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSnackbar } from '../composables/useSnackbar.js'
import constants from '../constants'
import dateUtils from '../utils/date.js'
import EventForm from '../components/EventForm.vue'
import oedbService from '../services/openeventdatabase.js'
import openstreetmapService from '../services/openstreetmap.js'
import { useEventsStore } from '../stores/events.js'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const { showSuccess, showError } = useSnackbar()

const eventId = String(route.params.id || '')
const isLoading = ref(true)
const isSubmitting = ref(false)
const initialForm = ref(null)
const existingEvent = ref(null)

const asTagsArray = (tags) => {
  if (Array.isArray(tags)) {
    return tags
  }

  if (typeof tags === 'string' && tags.trim()) {
    return [tags]
  }

  return []
}

const eventToForm = (event) => {
  return {
    what: event?.properties?.what || constants.OEDB_WHAT_LIST[0].key,
    label: event?.properties?.label || '',
    tags: asTagsArray(event?.properties?.tags),
    url: event?.properties?.url || '',
    start: dateUtils.toLocalDateTimeString(new Date(event?.properties?.start)),
    location: openstreetmapService.eventToPhotonLocation(event)
  }
}

const loadEvent = () => {
  const fromStore = eventsStore.getEventById(eventId)

  if (fromStore) {
    existingEvent.value = fromStore
    initialForm.value = eventToForm(fromStore)
    return Promise.resolve()
  }

  return eventsStore.fetchEvents({ forceRefresh: true })
    .then(() => {
      const loaded = eventsStore.getEventById(eventId)

      if (!loaded) {
        throw new Error('Séance introuvable')
      }

      existingEvent.value = loaded
      initialForm.value = eventToForm(loaded)
    })
}

const updateEvent = (eventForm) => {
  if (!existingEvent.value) {
    showError('Séance introuvable.')
    return
  }

  isSubmitting.value = true

  oedbService.updateEvent(existingEvent.value, eventForm)
    .then((response) => {
      console.log('Update response:', response)
      showSuccess('Séance modifiée avec succès !')
      // API returns { id: "..." }, so we need to fetch the updated event from the store
      return eventsStore.fetchEvents({ forceRefresh: true })
    })
    .then(() => {
      router.push(`/events/${eventId}`)
    })
    .catch((error) => {
      console.error('Erreur lors de la modification de la séance:', error)
      showError('Erreur lors de la modification de la séance.')
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

loadEvent()
  .catch((error) => {
    console.error('Impossible de charger la séance:', error)
    showError('Séance introuvable.')
    router.push('/events')
  })
  .finally(() => {
    isLoading.value = false
  })
</script>
