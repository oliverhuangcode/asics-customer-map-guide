import { useState, useMemo, useCallback } from 'react'
import { useLocations } from './hooks/useLocations.js'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import MapView from './components/MapView.jsx'

export default function App() {
  const { locations, loading } = useLocations()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [flyTarget, setFlyTarget] = useState(null)

  const categories = useMemo(() => {
    const seen = new Set()
    const result = []
    locations.forEach((loc) => {
      if (!seen.has(loc.category)) {
        seen.add(loc.category)
        result.push(loc.category)
      }
    })
    return result
  }, [locations])

  const filteredLocations = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return locations.filter((loc) => {
      const matchesSearch =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        loc.description.toLowerCase().includes(q)
      const matchesCategory =
        activeCategory === 'All' || loc.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [locations, searchQuery, activeCategory])

  const handleSidebarSelect = useCallback((location) => {
    setSelectedLocation(location)
    setFlyTarget({ location, key: Date.now() })
  }, [])

  const handleMarkerClick = useCallback((location) => {
    setSelectedLocation(location)
  }, [])

  return (
    <div className="flex flex-col h-screen font-sans bg-white">
      <Header />

      {/* Mobile: flex-col (map top, list bottom). Desktop: flex-row (list left, map right). */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Map — top on mobile, right on desktop */}
        <div className="flex-1 min-h-0 order-1 md:order-2">
          <MapView
            filteredLocations={filteredLocations}
            selectedLocation={selectedLocation}
            flyTarget={flyTarget}
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* List — bottom on mobile (fixed height), left on desktop */}
        <div className="flex-shrink-0 h-[44vh] md:h-full md:w-[420px] order-2 md:order-1">
          <Sidebar
            filteredLocations={filteredLocations}
            categories={categories}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            selectedLocation={selectedLocation}
            loading={loading}
            onSearchChange={setSearchQuery}
            onCategoryChange={setActiveCategory}
            onLocationSelect={handleSidebarSelect}
          />
        </div>

      </div>
    </div>
  )
}
