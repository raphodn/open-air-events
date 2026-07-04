const OSM_PHOTON_SEARCH_URL = 'https://photon.komoot.io/api/'

const photonSearch = (q) => {
  let url = `${OSM_PHOTON_SEARCH_URL}?q=${q}&limit=10`
  return fetch(url, {
      method: 'GET',
    })
    .then((response) => response.json())
    .then(data => data.features)
}

const photonLocationFullName = (location) => {
  let name = location.name || ''
  let housenumber = location.housenumber || ''
  let street = location.street || ''
  let city = location.city || ''
  let state = location.state || ''
  let country = location.country || ''
  return [name, housenumber, street, city, state, country].filter(Boolean).join(', ')
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
    lat: location.geometry.coordinates[1],
    lon: location.geometry.coordinates[0],
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

export default {
  photonSearch,
  photonLocationFullName,
  photonLocationType,
  photonLocationID,
  photonLocationToEventCoordinates,
  photonLocationToEventLocation
}
