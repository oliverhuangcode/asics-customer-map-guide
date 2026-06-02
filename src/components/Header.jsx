export default function Header() {
  return (
    <header
      className="flex-shrink-0 flex items-center px-4 md:px-7 bg-white z-10 h-[52px] md:h-[68px]"
      style={{ borderBottom: '1px solid #f3f4f6' }}
    >
      {/* Official ASICS logo */}
      <div className="flex items-center gap-5">
        <img
          src="/asics-logo.svg"
          alt="ASICS"
          className="h-6 w-auto select-none"
          draggable="false"
        />
        <div className="w-px h-5 bg-gray-200" aria-hidden="true" />
        <span
          className="tracking-widest uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '0.95rem', color: '#001E62', letterSpacing: '0.12em' }}
        >
          Melbourne Local Guide
        </span>
      </div>

      {/* Tagline + accent */}
      <div className="ml-auto flex items-center gap-4">
        <span className="text-[10px] font-mono tracking-[0.2em] text-gray-300 uppercase hidden sm:block">
          Sound Mind, Sound Body
        </span>
        <div
          className="w-1 h-8 rounded-sm flex-shrink-0"
          style={{ backgroundColor: '#E8003D' }}
          aria-hidden="true"
        />
      </div>
    </header>
  )
}
