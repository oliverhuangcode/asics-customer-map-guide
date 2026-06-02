export const SHEET_HEIGHT = 380
const ANIM_MS = 380

export default function BottomSheet({ isOpen, onClose, children }) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl flex flex-col"
      style={{
        height: SHEET_HEIGHT,
        transform: `translateY(${isOpen ? 0 : SHEET_HEIGHT}px)`,
        transition: `transform ${ANIM_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: 'transform',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
        zIndex: 500,
      }}
    >
      <div className="flex-shrink-0 flex items-center justify-between px-4 pt-2 pb-1.5">
        <div className="w-8" />
        <div className="w-10 h-1 rounded-full bg-gray-300" />
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 active:bg-gray-100"
          aria-label="Close list"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>
    </div>
  )
}
