import { useEffect, useRef } from 'react'
import { getCategoryColor } from '../utils/categories.js'
import LocationCard from './LocationCard.jsx'

export default function Sidebar({
  filteredLocations,
  categories,
  activeCategory,
  searchQuery,
  selectedLocation,
  loading,
  onSearchChange,
  onCategoryChange,
  onLocationSelect,
}) {
  const cardRefs = useRef({})

  useEffect(() => {
    if (selectedLocation) {
      const el = cardRefs.current[selectedLocation.id]
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }, [selectedLocation])

  return (
    <aside className="flex-shrink-0 w-full h-full md:w-[420px] flex flex-col border-r border-gray-100 bg-white">

      {/* Search */}
      <div className="flex-shrink-0 px-4 pt-3 pb-3 md:px-6 md:pt-6 md:pb-5 border-b border-gray-100 space-y-3 md:space-y-4">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search places…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-asics-blue focus:border-transparent transition"
          />
        </div>

        {/* Category filters */}
        <div>
          <p className="hidden md:block text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-2.5">
            Category
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-wrap md:overflow-x-visible">
            <CategoryPill
              label="All"
              active={activeCategory === 'All'}
              color="#003DA5"
              onClick={() => onCategoryChange('All')}
            />
            {categories.map((cat) => (
              <CategoryPill
                key={cat}
                label={cat}
                active={activeCategory === cat}
                color={getCategoryColor(cat)}
                onClick={() => onCategoryChange(cat)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Count */}
      <div className="flex-shrink-0 px-4 py-2 md:px-6 md:py-3 border-b border-gray-100">
        <span className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
          {loading
            ? 'Loading…'
            : `${filteredLocations.length} place${filteredLocations.length !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {!loading && filteredLocations.length === 0 && (
          <p className="px-6 py-10 text-sm text-gray-400 text-center">
            No places match your search.
          </p>
        )}
        {filteredLocations.map((loc) => (
          <LocationCard
            key={loc.id}
            location={loc}
            isSelected={selectedLocation?.id === loc.id}
            onSelect={onLocationSelect}
            cardRef={(el) => {
              cardRefs.current[loc.id] = el
            }}
          />
        ))}
      </div>
    </aside>
  )
}

function CategoryPill({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border transition-colors duration-150 focus:outline-none flex-shrink-0 whitespace-nowrap"
      style={
        active
          ? { backgroundColor: color, color: 'white', borderColor: color }
          : {
              backgroundColor: 'transparent',
              color: '#374151',
              borderColor: '#E5E7EB',
            }
      }
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: active ? 'rgba(255,255,255,0.7)' : color }}
      />
      {label}
    </button>
  )
}
