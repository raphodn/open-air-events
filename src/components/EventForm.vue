<template>
  <v-form @submit.prevent="submitForm">
    <h2 class="text-subtitle-1 font-weight-bold">Type</h2>

    <v-row>
      <v-col cols="12">
        <v-select
          v-model="eventForm.what"
          class="pl-4"
          variant="plain"
          density="compact"
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
      <v-col cols="12" md="6">
        <v-text-field
          v-model="eventForm.label"
          label="Film projeté *"
          list="film-label-suggestions"
          hide-details="auto"
          :rules="[rules.required]"
          required
        ></v-text-field>

        <datalist id="film-label-suggestions">
          <option v-for="label in filmLabelSuggestions" :key="label" :value="label" />
        </datalist>
      </v-col>

      <v-col cols="12" md="6">
        <v-combobox
          v-model="eventForm.tags"
          :items="existingTags"
          label="Tags"
          multiple
          chips
          closable-chips
          clearable
          hide-details="auto"
          hint="Optionnel. Par exemple le nom du festival."
          persistent-hint
        ></v-combobox>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="eventForm.url"
          label="Lien vers les détails de la séance *"
          hint="https://www.example.com"
          persistent-hint
          :rules="[rules.required, rules.url]"
          required
        ></v-text-field>

        <v-alert
          v-if="duplicateUrlEvent"
          type="warning"
          variant="outlined"
          density="compact"
          class="mt-2"
        >
          Cette URL existe deja pour la séance "{{ duplicateUrlEvent.properties.label }}".
        </v-alert>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="eventForm.start"
          label="Date et heure de debut *"
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
          prepend-icon="mdi-magnify"
          @click="openLocationDialog"
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
          :block="display.smAndDown.value"
          color="primary"
          type="submit"
          :disabled="!eventFormFilled"
          :loading="isSubmitting"
        >
          {{ submitLabel }}
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useEventsStore } from '../stores/events.js'
import constants from '../constants'
import eventsUtils from '../utils/events.js'
import LocationSearchDialog from './LocationSearchDialog.vue'
import LocationResult from './LocationResult.vue'

const props = defineProps({
  initialForm: {
    type: Object,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  submitLabel: {
    type: String,
    default: 'Enregistrer'
  },
  currentEventId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'cancel'])

const display = useDisplay()
const eventsStore = useEventsStore()
const { events } = storeToRefs(eventsStore)

onMounted(() => {
  if (!events.value.length) {
    eventsStore.fetchEvents()
      .catch((error) => {
        console.error('Error loading events for form helpers:', error)
      })
  }
})

const showLocationDialog = ref(false)
const eventForm = ref({
  what: constants.OEDB_WHAT_LIST[0].key,
  label: '',
  tags: [],
  url: '',
  start: '',
  location: ''
})

const rules = reactive({
  required: (value) => !!value || 'Ce champ est requis',
  url: (value) => {
    if (!value) return true
    const pattern = /^https?:\/\/.+/i
    return pattern.test(value) || 'URL invalide'
  },
  dateTimeFormat: (value) => {
    if (!value) return 'Date/heure requise'
    const date = new Date(value)
    return !Number.isNaN(date.getTime()) || 'Format date/heure invalide'
  }
})

watch(() => props.initialForm, (value) => {
  eventForm.value = {
    what: value?.what || constants.OEDB_WHAT_LIST[0].key,
    label: value?.label || '',
    tags: Array.isArray(value?.tags) ? value.tags : [],
    url: value?.url || '',
    start: value?.start || '',
    location: value?.location || ''
  }
}, { immediate: true })

const eventFormFilled = computed(() => {
  const requiredFields = ['what', 'label', 'url', 'start', 'location']
  return requiredFields.every((field) => !!eventForm.value[field])
})

const existingTags = computed(() => {
  return eventsUtils.getEventTags(events.value)
})

const filmLabelSuggestions = computed(() => {
  return eventsUtils.getEventLabels(events.value)
})

const duplicateUrlEvent = computed(() => {
  return eventsUtils.findDuplicateEventByUrl(events.value, eventForm.value.url, {
    excludeEventId: props.currentEventId
  })
})

const openLocationDialog = () => {
  showLocationDialog.value = true
}

const selectLocation = (location) => {
  eventForm.value.location = location
}

const submitForm = () => {
  if (!eventFormFilled.value) {
    alert('Veuillez corriger les erreurs avant de soumettre.')
    return
  }

  emit('submit', {
    ...eventForm.value,
    tags: Array.isArray(eventForm.value.tags) ? eventForm.value.tags : []
  })
}
</script>
