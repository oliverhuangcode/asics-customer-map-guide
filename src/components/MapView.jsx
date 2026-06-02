import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet'
import { getCategoryColor } from '../utils/categories.js'

const MELBOURNE = [-37.8136, 144.9631]
const LABEL_ZOOM_THRESHOLD = 14
const TILE_URL =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

function createMarkerIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="5.5" fill="white" opacity="0.95"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -38],
  })
}

function MapResizer() {
  const map = useMap()
  useEffect(() => {
    const container = map.getContainer()
    const ro = new ResizeObserver(() => map.invalidateSize({ animate: false }))
    ro.observe(container)
    return () => ro.disconnect()
  }, [map])
  return null
}

function MapController({ flyTarget }) {
  const map = useMap()
  useEffect(() => {
    if (!flyTarget) return
    const { lat, lng } = flyTarget.location
    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), {
      animate: true,
      duration: 0.8,
    })
  }, [flyTarget, map])
  return null
}

function ZoomTracker({ onZoom }) {
  const map = useMapEvents({
    zoomend() {
      onZoom(map.getZoom())
    },
  })
  return null
}

function PopupClearer({ selectedLocation }) {
  const map = useMap()
  useEffect(() => {
    if (!selectedLocation) map.closePopup()
  }, [selectedLocation, map])
  return null
}

function PopupContent({ location }) {
  const color = getCategoryColor(location.category)
  const mapsUrl =
    location.mapsUrl ||
    `https://www.google.com/maps?q=${location.lat},${location.lng}`

  return (
    <div className="p-3">
      <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5">
        {location.name}
      </h3>
      <span
        className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-2"
        style={{ backgroundColor: `${color}1A`, color }}
      >
        {location.category}
      </span>
      <p className="text-xs text-gray-400 mb-1.5">{location.address}</p>
      <p className="text-xs text-gray-600 leading-relaxed mb-3">
        {location.description}
      </p>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-semibold text-asics-blue hover:underline"
      >
        Open in Google Maps →
      </a>
    </div>
  )
}

export default function MapView({
  filteredLocations,
  selectedLocation,
  flyTarget,
  onMarkerClick,
}) {
  const markerRefs = useRef({})
  const [zoom, setZoom] = useState(14)

  useEffect(() => {
    if (!flyTarget) return
    const marker = markerRefs.current[flyTarget.location.id]
    if (marker && !marker.isPopupOpen()) marker.openPopup()
  }, [flyTarget])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={MELBOURNE}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
        zoomControl
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <MapResizer />
        <MapController flyTarget={flyTarget} />
        <ZoomTracker onZoom={setZoom} />
        <PopupClearer selectedLocation={selectedLocation} />

        {filteredLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createMarkerIcon(getCategoryColor(loc.category))}
            ref={(el) => {
              if (el) markerRefs.current[loc.id] = el
              else delete markerRefs.current[loc.id]
            }}
            eventHandlers={{ click: () => onMarkerClick(loc) }}
          >
            <Popup>
              <PopupContent location={loc} />
            </Popup>
            {zoom >= LABEL_ZOOM_THRESHOLD && (
              <Tooltip
                permanent
                direction="right"
                offset={[12, -22]}
                className="map-label"
              >
                {loc.name}
              </Tooltip>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
