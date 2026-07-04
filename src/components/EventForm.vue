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
          label="Nom du film projete *"
          hide-details="auto"
          :rules="[rules.required]"
          required
        ></v-text-field>
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
          label="Lien vers l'evenement *"
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
          Cette URL existe deja pour l'evenement "{{ duplicateUrlEvent.properties.label }}".
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

        <LocationResult
          v-if="eventForm.location"
          class="mt-4"
          :location="eventForm.location.properties"
        />

        <p v-else class="text-error">Aucun lieu selectionne</p>
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
          {{ submitLabel }}
        </v-btn>

        <v-btn
          variant="text"
          class="ml-2"
          @click="emit('cancel')"
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '../stores/events.js'
import constants from '../constants'
import utils from '../utils/utils.js'
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
  const tags = events.value.flatMap((event) => {
    const eventTags = event?.properties?.tags

    if (Array.isArray(eventTags)) {
      return eventTags
    }

    if (typeof eventTags === 'string' && eventTags.trim()) {
      return [eventTags]
    }

    return []
  })

  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b))
})

const duplicateUrlEvent = computed(() => {
  const normalizedUrl = utils.normalizeUrl(eventForm.value.url)

  if (!normalizedUrl) {
    return null
  }

  return events.value.find((event) => {
    if (props.currentEventId && event?.properties?.id === props.currentEventId) {
      return false
    }

    return utils.normalizeUrl(event?.properties?.url) === normalizedUrl
  }) ?? null
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
