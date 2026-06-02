import { getCategoryColor } from '../utils/categories.js'

export default function LocationCard({ location, isSelected, onSelect, cardRef }) {
  const color = getCategoryColor(location.category)

  return (
    <button
      ref={cardRef}
      onClick={() => onSelect(location)}
      className={[
        'w-full text-left px-4 py-3 md:px-6 md:py-5 border-b border-gray-100 transition-colors duration-150 focus:outline-none',
        isSelected
          ? 'bg-asics-blue'
          : 'hover:bg-gray-50 active:bg-gray-100',
      ].join(' ')}
    >
      <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between md:gap-3 mb-2">
        <h3
          className={[
            'text-sm font-semibold leading-snug',
            isSelected ? 'text-white' : 'text-gray-900',
          ].join(' ')}
        >
          {location.name}
        </h3>
        <span
          className="self-start inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-full whitespace-nowrap"
          style={
            isSelected
              ? { backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }
              : { backgroundColor: `${color}18`, color }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: isSelected ? 'white' : color }}
          />
          {location.category}
        </span>
      </div>
      <p
        className={[
          'text-xs mb-2',
          isSelected ? 'text-blue-200' : 'text-gray-400',
        ].join(' ')}
      >
        {location.address}
      </p>
      <p
        className={[
          'text-xs leading-relaxed line-clamp-2',
          isSelected ? 'text-blue-100' : 'text-gray-500',
        ].join(' ')}
      >
        {location.description}
      </p>
    </button>
  )
}
