const toNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const normalizeUrl = (url) => {
  return String(url ?? '')
    .trim()
    .toLowerCase()
    .replace(/\/+$/, '')
}

export default {
  toNumber,
  normalizeUrl,
}
