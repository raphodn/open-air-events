<template>
  <v-row>
    <v-col>
      <v-chip class="mr-2" size="small" color="primary" variant="tonal">
        {{ displayedEvents.length }}
      </v-chip>

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            class="mr-2"
            v-bind="props"
            color="primary"
            :variant="selectedDisplayMode === 'map' ? 'flat' : 'outlined'"
            :active="selectedDisplayMode === 'map'"
            size="small"
            prepend-icon="mdi-view-dashboard-outline"
            append-icon="mdi-menu-down"
          >
            Affichage
          </v-btn>
        </template>
        <v-card min-width="260" class="pa-4">
          <div class="d-flex flex-wrap ga-2">
            <v-chip
              v-for="option in displayModeOptions"
              :key="option.value"
              :variant="selectedDisplayMode === option.value ? 'flat' : 'outlined'"
              color="primary"
              size="small"
              :prepend-icon="option.icon"
              @click="selectedDisplayMode = option.value"
            >
              {{ option.title }}
            </v-chip>
          </div>
        </v-card>
      </v-menu>

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            class="mr-2"
            v-bind="props"
            color="primary"
            :variant="hasDateFilter ? 'flat' : 'outlined'"
            :active="hasDateFilter"
            size="small"
            prepend-icon="mdi-calendar-range"
            append-icon="mdi-menu-down"
          >
            Date
          </v-btn>
        </template>
        <v-card min-width="320" class="pa-4">
          <div class="d-flex flex-wrap ga-2 mb-3">
            <v-chip
              v-for="preset in datePresetOptions"
              :key="preset.value"
              :variant="selectedDatePreset === preset.value ? 'flat' : 'outlined'"
              color="primary"
              size="small"
              @click="toggleDatePreset(preset.value)"
            >
              {{ preset.title }}
            </v-chip>
          </div>

          <v-checkbox
            v-model="includePast"
            color="primary"
            density="compact"
            hide-details
            label="Afficher les séances passées"
          />
        </v-card>
      </v-menu>

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            class="mr-2"
            v-bind="props"
            color="primary"
            :variant="hasLieuFilter ? 'flat' : 'outlined'"
            :active="hasLieuFilter"
            size="small"
            prepend-icon="mdi-map-marker"
            append-icon="mdi-menu-down"
          >
            Lieu
          </v-btn>
        </template>
        <v-card min-width="320" class="pa-4">
          <v-select
            v-model="selectedCountyCode"
            :items="countyOptions"
            clearable
            density="compact"
            hide-details
            label="Département"
          />
        </v-card>
      </v-menu>

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            color="primary"
            :variant="hasInfoFilter ? 'flat' : 'outlined'"
            :active="hasInfoFilter"
            size="small"
            prepend-icon="mdi-information-outline"
            append-icon="mdi-menu-down"
          >
            Info
          </v-btn>
        </template>
        <v-card min-width="320" class="pa-4">
          <v-select
            v-model="selectedFilmLabel"
            :items="filmLabelOptions"
            clearable
            density="compact"
            hide-details
            label="Film"
            class="mb-3"
          />

          <v-select
            v-model="selectedTag"
            :items="tagOptions"
            clearable
            density="compact"
            hide-details
            label="Tag"
          />
        </v-card>
      </v-menu>
    </v-col>
  </v-row>

  <template v-if="selectedDisplayMode === 'grid'">
    <v-row class="mt-0">
      <v-col v-for="event in displayedEvents" :key="event.properties.id" cols="12" sm="6" md="4" xl="3">
        <EventCard :event="event" />
      </v-col>
    </v-row>
  </template>
  <template v-else-if="selectedDisplayMode === 'map'">
    <v-row class="mt-0">
      <v-col cols="12">
        <div class="event-list-map">
          <LeafletMap :events="displayedEvents" :showActions="false" />
        </div>
      </v-col>
    </v-row>
  </template>

  <br />
  <br />

  <v-divider />
  <br />

  <h2 class="text-h6 font-weight-bold">Il manque une séance ?</h2>

  <v-row>
    <v-col>
      <v-btn :block="display.smAndDown.value" color="primary" to="/events/create">Ajouter une séance</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useEventsStore } from '../stores/events.js'
import EventCard from '../components/EventCard.vue'
import LeafletMap from '../components/LeafletMap.vue'
import departements from '../data/departements.json'

const eventsStore = useEventsStore()
const route = useRoute()
const router = useRouter()
const display = useDisplay()

const { events } = storeToRefs(eventsStore)
const includePast = ref(route.query.past === '1')
const selectedCountyCode = ref(route.query.county ?? null)
const selectedDatePreset = ref(route.query.date ?? null)
const selectedFilmLabel = ref(route.query.film ?? null)
const selectedTag = ref(route.query.tag ?? null)
const selectedDisplayMode = ref(route.query.view === 'map' ? 'map' : 'grid')

const displayModeOptions = [
  { title: 'Grille', value: 'grid', icon: 'mdi-view-grid-outline' },
  { title: 'Carte', value: 'map', icon: 'mdi-map-outline' }
]

const datePresetOptions = [
  { title: "Aujourd'hui", value: 'today' },
  { title: 'Cette semaine', value: 'week' },
  { title: 'Ce week-end', value: 'weekend' },
  { title: 'La semaine prochaine', value: 'week-next' },
  { title: 'Ce mois-ci', value: 'month' }
]

const toggleDatePreset = (presetValue) => {
  selectedDatePreset.value = selectedDatePreset.value === presetValue ? null : presetValue
}

const countyOptions = computed(() => {
  return departements.map((departement) => {
    return {
      title: `${departement.code} - ${departement.nom}`,
      value: departement.code
    }
  })
})

const selectedCountyName = computed(() => {
  const county = departements.find((departement) => departement.code === selectedCountyCode.value)
  return county?.nom ?? null
})

const filmLabelOptions = computed(() => {
  const labels = events.value
    .map((event) => String(event?.properties?.label ?? '').trim())
    .filter(Boolean)

  return [...new Set(labels)].sort((a, b) => a.localeCompare(b))
})

const tagOptions = computed(() => {
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

const hasDateFilter = computed(() => {
  return includePast.value || !!selectedDatePreset.value
})

const hasLieuFilter = computed(() => {
  return !!selectedCountyCode.value
})

const hasInfoFilter = computed(() => {
  return !!selectedFilmLabel.value || !!selectedTag.value
})

watch(() => route.query.county, (depCode) => {
  selectedCountyCode.value = depCode ?? null
})

watch(() => route.query.date, (datePreset) => {
  selectedDatePreset.value = datePreset ?? null
})

watch(() => route.query.past, (past) => {
  includePast.value = past === '1'
})

watch(() => route.query.film, (film) => {
  selectedFilmLabel.value = film ?? null
})

watch(() => route.query.tag, (tag) => {
  selectedTag.value = tag ?? null
})

watch(() => route.query.view, (view) => {
  selectedDisplayMode.value = view === 'map' ? 'map' : 'grid'
})

watch(selectedCountyCode, (depCode) => {
  const query = { ...route.query }

  if (depCode) {
    query.county = depCode
  } else {
    delete query.county
  }

  router.replace({ query })
})

watch(selectedDatePreset, (datePreset) => {
  const query = { ...route.query }

  if (datePreset) {
    query.date = datePreset
  } else {
    delete query.date
  }

  router.replace({ query })
})

watch(includePast, (showPast) => {
  const query = { ...route.query }

  if (showPast) {
    query.past = '1'
  } else {
    delete query.past
  }

  router.replace({ query })
})

watch(selectedFilmLabel, (film) => {
  const query = { ...route.query }

  if (film) {
    query.film = film
  } else {
    delete query.film
  }

  router.replace({ query })
})

watch(selectedTag, (tag) => {
  const query = { ...route.query }

  if (tag) {
    query.tag = tag
  } else {
    delete query.tag
  }

  router.replace({ query })
})

watch(selectedDisplayMode, (mode) => {
  const query = { ...route.query }

  if (mode === 'map') {
    query.view = 'map'
  } else {
    delete query.view
  }

  router.replace({ query })
})

const getDatePresetRange = (preset) => {
  if (!preset) {
    return null
  }

  const now = new Date()

  if (preset === 'today') {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    return { start, end }
  }

  if (preset === 'week') {
    const day = now.getDay()
    const mondayOffset = day === 0 ? -6 : 1 - day
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset)
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
    return { start, end }
  }

  if (preset === 'weekend') {
    const day = now.getDay()
    const saturdayOffset = day === 0 ? -1 : 6 - day
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + saturdayOffset)
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 2)
    return { start, end }
  }

  if (preset === 'week-next') {
    const day = now.getDay()
    const mondayOffset = day === 0 ? -6 : 1 - day
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + 7)
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7)
    return { start, end }
  }

  if (preset === 'month') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return { start, end }
  }

  return null
}

const displayedEvents = computed(() => {
  const now = new Date().getTime()
  const selectedRange = getDatePresetRange(selectedDatePreset.value)

  return events.value.filter((event) => {
    const eventStart = new Date(event.properties.start).getTime()
    const isUpcoming = eventStart > now
    const eventCountyName = event.properties.osm_addr_county
    const eventTags = Array.isArray(event.properties.tags)
      ? event.properties.tags
      : (typeof event.properties.tags === 'string' && event.properties.tags.trim() ? [event.properties.tags] : [])

    if (selectedRange) {
      const rangeStart = selectedRange.start.getTime()
      const rangeEnd = selectedRange.end.getTime()

      if (eventStart < rangeStart || eventStart >= rangeEnd) {
        return false
      }
    }

    if (!includePast.value && !isUpcoming) {
      return false
    }

    if (selectedCountyCode.value && eventCountyName !== selectedCountyName.value) {
      return false
    }

    if (selectedFilmLabel.value && event.properties.label !== selectedFilmLabel.value) {
      return false
    }

    if (selectedTag.value && !eventTags.includes(selectedTag.value)) {
      return false
    }

    return true
  })
})

</script>

<style scoped>
.event-list-map {
  height: min(70vh, 760px);
  min-height: 420px;
}
</style>
