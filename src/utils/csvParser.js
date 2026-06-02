import Papa from 'papaparse'

const CACHE_KEY = 'asics_geocode_cache'

const geocodeCache = {
  _data: null,
  _load() {
    if (this._data) return
    try { this._data = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}') }
    catch { this._data = {} }
  },
  get(lat, lng) { this._load(); return this._data[`${lat},${lng}`] || null },
  set(lat, lng, address) {
    this._load()
    this._data[`${lat},${lng}`] = address
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(this._data)) } catch {}
  },
}

export async function fetchAndParseCSV(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const text = await response.text()

  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
    transform: (v) => v.trim(),
  })

  if (errors.length && data.length === 0) throw new Error('CSV parse failed')

  // First pass: extract name and coordinates from URL (instant, no API)
  const rows = data
    .filter((row) => (row['Google Maps URL'] || '').trim())
    .map((row, i) => {
      const mapsUrl = row['Google Maps URL'] || ''
      const coords = extractCoordsFromUrl(mapsUrl)
      const name = extractNameFromUrl(mapsUrl)
      return {
        id: `csv-${i}`,
        name,
        category: row['Category'] || 'Other',
        description: row['Description'] || '',
        // Address column is optional — if absent we reverse-geocode
        address: row['Address'] || '',
        mapsUrl,
        coords,
      }
    })
    .filter((r) => r.name && r.coords)

  // Second pass: reverse-geocode address for any row that doesn't have one.
  // Results are cached in localStorage so geocoding only happens once per location.
  const needsAddress = rows.filter((r) => !r.address)
  const uncached = needsAddress.filter((r) => !geocodeCache.get(r.coords.lat, r.coords.lng))

  for (const row of uncached) {
    try {
      const address = await reverseGeocode(row.coords.lat, row.coords.lng)
      geocodeCache.set(row.coords.lat, row.coords.lng, address)
      await sleep(1100)
    } catch {
      // leave address empty, falls back to name below
    }
  }

  for (const row of needsAddress) {
    row.address = geocodeCache.get(row.coords.lat, row.coords.lng) || row.name
  }

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    address: r.address || r.name,
    description: r.description,
    lat: r.coords.lat,
    lng: r.coords.lng,
    mapsUrl: r.mapsUrl,
  }))
}

// google.com/maps/place/Federation+Square/@-37.818,144.9691,15z/…
function extractNameFromUrl(url) {
  const match = url.match(/\/maps\/place\/([^/@?]+)/)
  if (!match) return null
  return decodeURIComponent(match[1].replace(/\+/g, ' ')).trim() || null
}

// Handles /@lat,lng and ?q=lat,lng
function extractCoordsFromUrl(url) {
  if (!url) return null
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
  return null
}

async function reverseGeocode(lat, lng) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { 'User-Agent': 'ASICS-Melbourne-Guide/1.0' } },
  )
  if (!res.ok) throw new Error('Reverse geocode failed')
  const data = await res.json()
  const a = data.address || {}
  const road = a.road || a.pedestrian || a.footway
  const area = a.suburb || a.neighbourhood || a.city_district || a.city
  const statePostcode = a.postcode ? `VIC ${a.postcode}` : null
  const parts = [road, area, statePostcode].filter(Boolean)
  return parts.length ? parts.join(', ') : data.display_name?.split(',').slice(0, 3).join(',').trim()
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
