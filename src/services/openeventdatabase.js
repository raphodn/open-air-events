import eventsData from '@/data/events.json'


const OEDB_API_URL = 'https://api.openeventdatabase.org'
const EVENT_WHAT = 'culture.cinema.outdoor'


const getEventsFromJSON = () => {
  return Promise.resolve(eventsData)
}

const getEvents = () => {
  return fetch(`${OEDB_API_URL}/event?what=${EVENT_WHAT}&start=2020-01-01T00:00`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'User-Agent': 'CinéPleinAir'
    }
  })
  .then(response => response.json())
}

const createEvent = (eventData) => {
  // filter out some keys
  const keysToRemove = ['lat', 'lon']
  const eventProperties = Object.fromEntries(Object.entries(eventData).filter(([key]) => !keysToRemove.includes(key)))
  // build the payload (geoJSON)
  const payload = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [eventData.lon, eventData.lat]
    },
    'properties': {
      'type': 'scheduled',
      'what': EVENT_WHAT,
      ...eventProperties
    }
  }
  return fetch(`${OEDB_API_URL}/event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'User-Agent': 'CinéPleinAir'
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
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
