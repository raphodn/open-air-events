import constants from '@/constants.js'
import eventsJSON from '@/data/events.json'
import dateUtils from '../utils/date.js'
import geoUtils from '../utils/geo.js'
import openstreetmapService from '../services/openstreetmap.js'


// only 2026 for now
const OEDB_START_STOP = 'start=2026-01-01T00:00&stop=2026-12-31T23:59'
// const OEDB_START_STOP = '?when=NEXT365DAYS'
const OEDB_LIMIT = 1000

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
 * Get events from the OpenEventDatabase API, with optional force refresh.
 */
const getEvents = ({ forceRefresh = false } = {}) => {
  // Reuse the ongoing fetch to avoid duplicate concurrent requests.
  if (eventsRequestPromise) {
    return eventsRequestPromise
  }

  eventsRequestPromise = fetchEvents()
    .then((data) => {
      // order by start date ascending
      data.features.sort((a, b) => new Date(a.properties.start) - new Date(b.properties.start))
      return data
    })
    .finally(() => {
      eventsRequestPromise = null
    })

  return eventsRequestPromise
}

const buildEventPayload = (eventData, existingEvent = null) => {
  const eventTimestamps = {
    start: dateUtils.formatDateTimeWithTZ(eventData.start),
    stop: dateUtils.formatDateTimeWithTZ(dateUtils.dateTimeAddHours(eventData.start, 2)) // +2 hours
  }

  // map the photon location object to the event location object
  const eventCoordinates = openstreetmapService.photonLocationToEventCoordinates(eventData.location)
  const eventLocation = openstreetmapService.photonLocationToEventLocation(eventData.location)
  const eventProperties = { ...eventData, ...eventTimestamps, ...eventLocation }
  const baseProperties = existingEvent?.properties ? { ...existingEvent.properties } : {}

  delete eventProperties.location // Remove the original location object

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: eventCoordinates
    },
    properties: {
      type: 'scheduled',
      ...baseProperties,
      ...eventProperties
    }
  }
}

const createEvent = (eventData) => {
  const payload = buildEventPayload(eventData)

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
    return createdEvent
  })
}

const updateEvent = (existingEvent, eventData) => {
  const eventId = existingEvent?.properties?.id

  if (!eventId) {
    return Promise.reject(new Error('Missing event id'))
  }

  const payload = buildEventPayload(eventData, existingEvent)
  delete payload.properties.id

  return fetch(`${constants.OEDB_API_URL}/event/${eventId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // 'User-Agent': 'CinéPleinAir'
    },
    body: JSON.stringify(payload)
  })
  .then((response) => {
    if (response.status !== 200) {
      throw new Error(`Erreur: ${response.status}`)
    }

    return response.json()
  })
  .then((updatedEvent) => {
    return updatedEvent
  })
}

// Examples:
// - Salle des fêtes, Route de la Pierre de Dîme, Saint-Jean-d'Hérans (38)
// - La Flachère (38)
const eventLocationFullName = (event) => {
  let osm_key = event.properties.osm_key || ''
  let osm_value = event.properties.osm_value || ''
  let name = event.properties.osm_name || ''
  let housenumber = event.properties.osm_addr_housenumber || ''
  let street = event.properties.osm_addr_street || ''
  let city = event.properties.osm_addr_city || ''
  let postcode = event.properties.osm_addr_postcode || ''
  let postcodeShortPart = postcode ? `(${geoUtils.getDepartmentCodeFromPostcode(postcode)})` : ''
  let cityWithPostcodeShortPart = city ? `${city} ${postcodeShortPart}` : ''
  // let state = event.properties.osm_addr_state || ''
  // let country = event.properties.osm_addr_country || ''

  // Some locations (like villages) have missing info
  if (osm_key === 'place' && ['village', 'town'].includes(osm_value)) {
    return `${name} ${postcodeShortPart}`.trim()
  }
  return [name, street, cityWithPostcodeShortPart].filter(Boolean).join(', ')
}

export default {
  getEventsFromJSON,
  getEvents,
  createEvent,
  updateEvent,
  eventLocationFullName
}
