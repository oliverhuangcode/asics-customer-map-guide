import { useState, useEffect } from 'react'
import { fetchAndParseCSV } from '../utils/csvParser.js'
import fallbackData from '../data/fallbackData.js'

export function useLocations() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const url = import.meta.env.VITE_SHEET_CSV_URL

    if (!url) {
      setLocations(fallbackData)
      setLoading(false)
      return
    }

    fetchAndParseCSV(url)
      .then((parsed) => {
        setLocations(parsed.length > 0 ? parsed : fallbackData)
      })
      .catch(() => {
        setLocations(fallbackData)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { locations, loading }
}
