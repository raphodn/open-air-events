import constants from '@/constants.js'
import geoUtils from '../utils/geo.js'


const photonSearch = (q) => {
  let url = `${constants.OSM_PHOTON_SEARCH_API_URL}?q=${q}&limit=10`
  return fetch(url, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then(data => data.features)
}

// Example: Salle des fêtes, Route de la Pierre de Dîme, Saint-Jean-d'Hérans (38), Auvergne-Rhône-Alpes, France
const photonLocationFullName = (location) => {
  let name = location.name || ''
  let housenumber = location.housenumber || ''
  let street = location.street || ''
  let city = location.city || ''
  let postcode = location.postcode || ''
  let cityWithPostcodeShortPart = city ? `${city} ${postcode ? `(${geoUtils.getDepartmentCodeFromPostcode(postcode)})` : ''}` : ''
  let state = location.state || ''
  let country = location.country || ''
  return [name, housenumber, street, cityWithPostcodeShortPart, state, country].filter(Boolean).join(', ')
}

const photonLocationType = (location) => {
  return `${location.osm_key}:${location.osm_value}`
}

const photonLocationID = (location) => {
  return `${location.osm_type}:${location.osm_id}`
}

const photonLocationToEventCoordinates = (location) => {
  return [location.geometry.coordinates[0], location.geometry.coordinates[1]]
}

const photonLocationToEventLocation = (location) => {
  return {
    osm_id: location.properties.osm_id,
    osm_type: location.properties.osm_type,
    osm_key: location.properties.osm_key,
    osm_value: location.properties.osm_value,
    osm_name: location.properties.name || '',
    osm_addr_housenumber: location.properties.housenumber || '',
    osm_addr_street: location.properties.street || '',
    osm_addr_postcode: location.properties.postcode || '',
    osm_addr_city: location.properties.city || '',
    osm_addr_county: location.properties.county || '',
    osm_addr_state: location.properties.state || '',
    osm_addr_country: location.properties.country || '',
    osm_addr_countrycode: location.properties.countrycode || '',
  }
}

const eventToPhotonLocation = (event) => {
  const properties = event?.properties || {}
  const lon = Number(properties.lon ?? event?.geometry?.coordinates?.[0] ?? 0)
  const lat = Number(properties.lat ?? event?.geometry?.coordinates?.[1] ?? 0)

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    },
    properties: {
      osm_id: properties.osm_id,
      osm_type: properties.osm_type,
      osm_key: properties.osm_key,
      osm_value: properties.osm_value,
      name: properties.osm_name || '',
      housenumber: properties.osm_addr_housenumber || '',
      street: properties.osm_addr_street || '',
      postcode: properties.osm_addr_postcode || '',
      city: properties.osm_addr_city || '',
      county: properties.osm_addr_county || '',
      state: properties.osm_addr_state || '',
      country: properties.osm_addr_country || '',
      countrycode: properties.osm_addr_countrycode || ''
    }
  }
}

export default {
  photonSearch,
  photonLocationFullName,
  photonLocationType,
  photonLocationID,
  photonLocationToEventCoordinates,
  photonLocationToEventLocation,
  eventToPhotonLocation
}
