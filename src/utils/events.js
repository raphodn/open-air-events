import utils from './utils.js'

const getEventTags = (events) => {
  const tags = (events || []).flatMap((event) => {
    const eventTags = event?.properties?.tags

    if (Array.isArray(eventTags)) {
      return eventTags
    }

    if (typeof eventTags === 'string' && eventTags.trim()) {
      return [eventTags]
    }

    return []
  })

  return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b))
}

const getEventLabels = (events) => {
  const labels = (events || [])
    .map((event) => String(event?.properties?.label ?? '').trim())
    .filter(Boolean)

  return [...new Set(labels)].sort((a, b) => a.localeCompare(b))
}

const findDuplicateEventByUrl = (events, url, { excludeEventId = '' } = {}) => {
  const normalizedUrl = utils.normalizeUrl(url)

  if (!normalizedUrl) {
    return null
  }

  return (events || []).find((event) => {
    if (excludeEventId && event?.properties?.id === excludeEventId) {
      return false
    }

    return utils.normalizeUrl(event?.properties?.url) === normalizedUrl
  }) ?? null
}

export default {
  getEventTags,
  getEventLabels,
  findDuplicateEventByUrl
}
