import constants from '@/constants.js'
import eventsJSON from '@/data/events.json'
import dateUtils from '../utils/date.js'
import openstreetmapService from '../services/openstreetmap.js'


// only 2026 for now
const OEDB_START_STOP = 'start=2026-01-01T00:00&stop=2026-12-31T23:59'
// const OEDB_START_STOP = '?when=NEXT365DAYS'
const OEDB_LIMIT = 1000

let eventsCache = null
let eventsLastSyncDate = null
let eventsRequestPromise = null


const getEventsFromJSON = () => {
  return Promise.resolve(eventsJSON)
}

/**
 * Fetch events from the OpenEventDatabase API
 */
const fetchEvents = () => {
  return fetch(`${constants.OEDB_API_URL}/event?what=${constants.OEDB_WHAT_DEFAULT}&${OEDB_START_STOP}&limit=${OEDB_LIMIT}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'User-Agent': 'CinéPleinAir'
    }
  })
  .then(response => response.json())
}

/**
 * Get events from the OpenEventDatabase API, with caching and optional force refresh.
 */
const getEvents = ({ forceRefresh = false } = {}) => {
  // Return the last successful payload immediately when cache is warm.
  if (!forceRefresh && eventsCache) {
    return Promise.resolve(eventsCache)
  }

  // Reuse the ongoing fetch to avoid duplicate concurrent requests.
  if (!forceRefresh && eventsRequestPromise) {
    return eventsRequestPromise
  }

  eventsRequestPromise = fetchEvents()
    .then((data) => {
      eventsCache = data
      eventsLastSyncDate = new Date()
      return data
    })
    .finally(() => {
      eventsRequestPromise = null
    })

  return eventsRequestPromise
}

const getEventsCount = () => {
  if (eventsCache && eventsCache.features) {
    return eventsCache.features.length
  }
  return 0
}

const getEventsLastSyncDate = () => {
  return eventsLastSyncDate
}

const clearEventsCache = () => {
  eventsCache = null
  eventsLastSyncDate = null
}

const createEvent = (eventData) => {
  // manage timestamps
  // add stop key & and TZ
  const eventTimestamps = {
    start: dateUtils.formatDateTimeWithTZ(eventData.start),
    stop: dateUtils.formatDateTimeWithTZ(dateUtils.dateTimeAddHours(eventData.start, 2)) // +2 hours
  }
  // manage location
  // map the photon location object to the event location object
  const eventLocation = openstreetmapService.photonLocationToEventLocation(eventData.location)
  const eventProperties = { ...eventData, ...eventTimestamps, ...eventLocation }
  delete eventProperties.location // Remove the original location object
  // build the payload (geoJSON)
  const payload = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [eventProperties.lon, eventProperties.lat]
    },
    'properties': {
      'type': 'scheduled',
      // 'what': constants.OEDB_WHAT_DEFAULT,  // already provided by eventData
      ...eventProperties
    }
  }

  return fetch(`${constants.OEDB_API_URL}/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'User-Agent': 'CinéPleinAir'
    },
    body: JSON.stringify(payload)
  })
  .then((response) => {
    if (response.status !== 201) {
      throw new Error(`Erreur: ${response.status}`)
    }

    return response.json()
  })
  .then((createdEvent) => {
    clearEventsCache()
    return createdEvent
  })
}

const eventLocationFullName = (event) => {
  let name = event.properties.osm_name || ''
  let housenumber = event.properties.osm_addr_housenumber || ''
  let street = event.properties.osm_addr_street || ''
  let city = event.properties.osm_addr_city || ''
  let country = event.properties.osm_addr_country || ''
  return [name, street, city, country].filter(Boolean).join(', ')
}

export default {
  getEventsFromJSON,
  getEvents,
  getEventsCount,
  getEventsLastSyncDate,
  clearEventsCache,
  createEvent,
  eventLocationFullName
}
