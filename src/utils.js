const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString()
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
  formatDateTimeWithTZ,
  toLocalDateTimeString,
  dateTimeAddHours
}
