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
          <v-switch
            v-model="includePast"
            color="primary"
            density="compact"
            hide-details
            label="Afficher les événements passés"
          />
        </v-card>
      </v-menu>

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
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
    </v-col>
  </v-row>

  <v-row class="mt-0">
    <v-col v-for="event in displayedEvents" :key="event.properties.id" cols="12" sm="6" md="4" xl="3">
      <EventCard :event="event" />
    </v-col>
  </v-row>

  <v-row>
    <v-col>
      <v-btn color="primary" to="/events/create">Ajouter un événement manquant</v-btn>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '../stores/events.js'
import EventCard from '../components/EventCard.vue'
import departements from '../data/departements.json'

const eventsStore = useEventsStore()
const route = useRoute()
const router = useRouter()

const { events } = storeToRefs(eventsStore)
const includePast = ref(false)
const selectedCountyCode = ref(route.query.county ?? null)

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

const hasDateFilter = computed(() => {
  return includePast.value
})

const hasLieuFilter = computed(() => {
  return !!selectedCountyCode.value
})

watch(() => route.query.county, (depCode) => {
  selectedCountyCode.value = depCode ?? null
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

const displayedEvents = computed(() => {
  const now = new Date().getTime()

  return events.value.filter((event) => {
    const isUpcoming = new Date(event.properties.start).getTime() > now
    const eventCountyName = event.properties.osm_addr_county

    if (!includePast.value && !isUpcoming) {
      return false
    }

    if (selectedCountyCode.value && eventCountyName !== selectedCountyName.value) {
      return false
    }

    return true
  })
})
</script>

<style scoped>
</style>
