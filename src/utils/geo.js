import utils from './utils.js'


const getLocationProperties = (locationObject) => {
  return locationObject?.properties || locationObject || {}
}

const getLocationOSMLatLng = (locationObject) => {
  if (locationObject?.geometry?.coordinates?.length >= 2) {
    const lat = utils.toNumber(locationObject.geometry.coordinates[1])
    const lon = utils.toNumber(locationObject.geometry.coordinates[0])
    if (lat !== null && lon !== null) {
      return [lat, lon]
    }
  }

  const props = getLocationProperties(locationObject)
  const lat = utils.toNumber(props.lat ?? props.osm_lat)
  const lon = utils.toNumber(props.lon ?? props.osm_lon)
  if (lat !== null && lon !== null) {
    return [lat, lon]
  }

  return [45, 5]
}

const getMapBounds = (locations) => {
  if (!Array.isArray(locations) || !locations.length) {
    return null
  }
  return locations.map((location) => getLocationOSMLatLng(location))
}

const getLocationOSMName = (locationObject) => {
  const props = getLocationProperties(locationObject)
  return props.name || props.osm_name || ''
}

const getLocationOSMRoad = (locationObject) => {
  const props = getLocationProperties(locationObject)
  const houseNumber = props.housenumber || props.osm_addr_housenumber || ''
  const street = props.street || props.osm_addr_street || ''
  if (!houseNumber && !street) {
    return ''
  }
  return [houseNumber, street].filter(Boolean).join(', ')
}

const getLocationOSMCity = (locationObject) => {
  const props = getLocationProperties(locationObject)
  return props.city || props.town || props.village || props.municipality || props.osm_addr_city || ''
}

const getLocationOSMTitle = (locationObject, withName = true, withRoad = false, withCity = true) => {
  const parts = []
  if (withName) {
    parts.push(getLocationOSMName(locationObject))
  }
  if (withRoad) {
    parts.push(getLocationOSMRoad(locationObject))
  }
  if (withCity) {
    parts.push(getLocationOSMCity(locationObject))
  }

  const title = parts.filter(Boolean).join(', ')
  if (title) {
    return title
  }

  const props = getLocationProperties(locationObject)
  return props.display_name || 'Adresse inconnue'
}

const getLocationOSMUniqueId = (locationObject) => {
  const props = getLocationProperties(locationObject)
  if (props.osm_type && props.osm_id) {
    return `${props.osm_type}${props.osm_id}`
  }
  const [lat, lon] = getLocationOSMLatLng(locationObject)
  return `${lat}:${lon}`
}

const getLocationOSMTag = (locationObject) => {
  const props = getLocationProperties(locationObject)
  const key = props.osm_key || props.class || 'unknown'
  const value = props.osm_value || props.type || 'unknown'
  return `${key}:${value}`
}

export default {
  getMapBounds,
  getLocationOSMTitle,
  getLocationOSMUniqueId,
  getLocationOSMTag,
  getLocationOSMLatLng,
}
