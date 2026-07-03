/**
 * Input: date string in the format "YYYY-MM-DDTHH:mm"
 * Output: date string in the format "DD/MM/YYYY"
 */
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr')
}

/**
 * Input: date string in the format "YYYY-MM-DDTHH:mm"
 * Output: time string in the format "HH:mm"
 */
const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Input: date string in the format "YYYY-MM-DDTHH:mm"
 * Output: date string in the format "DD/MM/YYYY HH:mm"
 */
const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('fr', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('fr', {
  numeric: 'always'
})

const formatRelativeTime = (dateInput) => {
  const date = new Date(dateInput)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const elapsedSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const ranges = [
    { unit: 'year', seconds: 60 * 60 * 24 * 365 },
    { unit: 'month', seconds: 60 * 60 * 24 * 30 },
    { unit: 'day', seconds: 60 * 60 * 24 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 }
  ]

  const range = ranges.find((item) => Math.abs(elapsedSeconds) >= item.seconds) ?? ranges[ranges.length - 1]
  const value = Math.round(elapsedSeconds / range.seconds)

  return relativeTimeFormatter.format(value, range.unit)
}

const dateIsInThePast = (dateInput) => {
  return new Date(dateInput).getTime() < Date.now()
}

const dateIsToday = (dateInput) => {
  const eventDate = new Date(dateInput)
  const now = new Date()

  return eventDate.getFullYear() === now.getFullYear()
    && eventDate.getMonth() === now.getMonth()
    && eventDate.getDate() === now.getDate()
}

/**
 * Input: date string in the format "YYYY-MM-DDTHH:mm"
 * Output: date string in the format "YYYY-MM-DDTHH:mm:ss±HHMM" (includes the local timezone offset)
 */
const formatDateTimeWithTZ = (dateString) => {
  // Get timezone offset
  const now = new Date()
  const offset = -now.getTimezoneOffset()
  const hours = Math.floor(Math.abs(offset) / 60)
  const minutes = Math.abs(offset) % 60
  const sign = offset >= 0 ? '+' : '-'
  const tzOffset = `${sign}${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}`
  
  // Simply append :00 and offset to the local datetime string
  return `${dateString}:00${tzOffset}`
}

const toLocalDateTimeString = (date) => {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const dateTimeAddHours = (dateTimeLocal, hoursToAdd) => {
  const date = new Date(dateTimeLocal)
  date.setHours(date.getHours() + hoursToAdd)
  return toLocalDateTimeString(date)
}

export default {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  dateIsInThePast,
  dateIsToday,
  formatDateTimeWithTZ,
  toLocalDateTimeString,
  dateTimeAddHours
}
