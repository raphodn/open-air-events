import constants from '@/constants.js'
import eventsData from '@/data/events.json'
import utils from '../utils.js'
import openstreetmapService from '../services/openstreetmap.js'


const OEDB_API_URL = 'https://api.openeventdatabase.org'
const EVENT_WHAT = 'culture.cinema.outdoor'


const getEventsFromJSON = () => {
  return Promise.resolve(eventsData)
}

const getEvents = () => {
  return fetch(`${constants.OEDB_API_URL}/event?what=${constants.OEDB_WHAT_DEFAULT}&start=2020-01-01T00:00`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'User-Agent': 'CinéPleinAir'
    }
  })
  .then(response => response.json())
}

const createEvent = (eventData) => {
  // manage timestamps
  // add stop key & and TZ
  const eventTimestamps = {
    start: utils.formatDateTimeWithTZ(eventData.start),
    stop: utils.formatDateTimeWithTZ(utils.dateTimeAddHours(eventData.start, 2)) // +2 hours
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
  createEvent,
  eventLocationFullName
}
