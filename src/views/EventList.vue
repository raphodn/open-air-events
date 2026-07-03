<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-switch
        v-model="includePast"
        color="primary"
        density="compact"
        hide-details
        label="Afficher les événements passés"
      />
    </v-col>

    <v-col cols="12" md="6">
      <v-select
        v-model="selectedDepartmentCode"
        :items="departmentOptions"
        clearable
        density="compact"
        hide-details
        label="Département"
      />
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
import EventCard from '../components/EventCard.vue'
import { useEventsStore } from '../stores/events.js'
import departements from '../data/departements.json'

const eventsStore = useEventsStore()
const route = useRoute()
const router = useRouter()

const { events } = storeToRefs(eventsStore)
const includePast = ref(false)
const selectedDepartmentCode = ref(route.query.county ?? null)

const departmentOptions = computed(() => {
  return departements.map((departement) => {
    return {
      title: `${departement.code} - ${departement.nom}`,
      value: departement.code
    }
  })
})

const selectedDepartmentName = computed(() => {
  const department = departements.find((departement) => departement.code === selectedDepartmentCode.value)
  return department?.nom ?? null
})

watch(() => route.query.county, (depCode) => {
  selectedDepartmentCode.value = depCode ?? null
})

watch(selectedDepartmentCode, (depCode) => {
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
    const eventDepartmentName = event.properties.osm_addr_county

    if (!includePast.value && !isUpcoming) {
      return false
    }

    if (selectedDepartmentCode.value && eventDepartmentName !== selectedDepartmentName.value) {
      return false
    }

    return true
  })
})
</script>
