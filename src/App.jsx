import { useState, useMemo, useCallback, useLayoutEffect } from 'react'
import { useLocations } from './hooks/useLocations.js'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import MapView from './components/MapView.jsx'
import BottomSheet, { SHEET_HEIGHT } from './components/BottomSheet.jsx'

const ANIM_MS = 380

export default function App() {
  const { locations, loading } = useLocations()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [flyTarget, setFlyTarget] = useState(null)

  // sheetOpen drives the animation immediately; sheetCollapsed (delayed) drives FAB visibility
  const [sheetOpen, setSheetOpen] = useState(true)
  const [sheetCollapsed, setSheetCollapsed] = useState(false)

  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const closeSheet = useCallback(() => {
    setSheetOpen(false)
    setTimeout(() => {
      setSheetCollapsed(true)
      setSelectedLocation(null)
    }, ANIM_MS)
  }, [])

  const openSheet = useCallback(() => {
    setSheetCollapsed(false)
    setSheetOpen(true)
  }, [])

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
    setFlyTarget({ location, key: Date.now() })
    if (isMobile) openSheet()
  }, [isMobile, openSheet])

  const sidebarProps = {
    filteredLocations,
    categories,
    activeCategory,
    searchQuery,
    selectedLocation,
    loading,
    onSearchChange: setSearchQuery,
    onCategoryChange: setActiveCategory,
    onLocationSelect: handleSidebarSelect,
  }

  const mapProps = {
    filteredLocations,
    selectedLocation,
    flyTarget,
    onMarkerClick: handleMarkerClick,
  }

  return (
    <div className="flex flex-col h-screen font-sans bg-white">
      <Header />

      {isMobile ? (
        <div className="flex-1 relative overflow-hidden">
          {/* Map — shrinks/grows in sync with the sheet animation */}
          <div
            className="absolute inset-x-0 top-0"
            style={{
              bottom: sheetOpen ? SHEET_HEIGHT : 0,
              transition: `bottom ${ANIM_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            }}
          >
            <MapView {...mapProps} />
          </div>

          {/* FAB — appears after sheet has fully closed */}
          {sheetCollapsed && (
            <button
              onClick={openSheet}
              className="absolute bottom-8 left-4 z-[1000] w-14 h-14 rounded-full bg-[#001E62] text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Browse places"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          )}

          <BottomSheet isOpen={sheetOpen} onClose={closeSheet}>
            <Sidebar {...sidebarProps} />
          </BottomSheet>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-shrink-0 w-[420px]">
            <Sidebar {...sidebarProps} />
          </div>
          <div className="flex-1 min-h-0">
            <MapView {...mapProps} />
          </div>
        </div>
      )}
    </div>
  )
}
