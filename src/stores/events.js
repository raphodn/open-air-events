import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import oedbService from '../services/openeventdatabase.js'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const eventsCount = ref(0)
  const eventsLastSyncDate = ref(null)

  const upcomingEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.properties.start).getTime() > now.getTime())
  })

  const pastEvents = computed(() => {
    const now = new Date()
    return events.value.filter(event => new Date(event.properties.start).getTime() <= now.getTime())
  })

  const fetchEvents = ({ forceRefresh = false } = {}) => {
    return oedbService.getEvents({ forceRefresh }).then((data) => {
      events.value = data?.features ?? []
      eventsCount.value = data?.count ?? data?.features?.length ?? 0
      eventsLastSyncDate.value = new Date()
    })
  }

  const getEventById = (id) => {
    return events.value.find(event => event.properties.id === id)
  }

  return {
    events,
    eventsCount,
    eventsLastSyncDate,
    upcomingEvents,
    pastEvents,
    fetchEvents,
    getEventById
  }
})
