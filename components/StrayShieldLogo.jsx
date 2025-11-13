export default function StrayShieldLogo({ size = "md" }) {
  const sizeClass = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }[size]

  return (
    <div
      className={`${sizeClass} bg-gradient-to-br from-green-200 to-blue-200 rounded-lg flex items-center justify-center shadow-sm`}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
        {/* Shield background */}
        <path
          d="M12 2L4 5.5V11C4 16.5 12 21 12 21C12 21 20 16.5 20 11V5.5L12 2Z"
          fill="url(#shieldGradient)"
          opacity="0.8"
        />
        {/* Dog head (simplified) */}
        <circle cx="12" cy="9" r="3" fill="#78350f" opacity="0.9" />
        {/* Ears */}
        <path d="M10 7L9 5M14 7L15 5" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        {/* Heart/Care symbol */}
        <path d="M12 14L13.5 15.5L12 17L10.5 15.5L12 14Z" fill="#f472b6" opacity="0.8" />
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#86efac", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#93c5fd", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
