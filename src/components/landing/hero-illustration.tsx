export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 360"
      className="h-auto w-full max-w-md drop-shadow-[0_25px_50px_rgba(37,99,235,0.2)]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="hg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="hg2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.55" />
        </linearGradient>
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <ellipse cx="240" cy="300" rx="200" ry="24" fill="#0f172a" opacity="0.06" />
      <circle cx="120" cy="100" r="64" fill="url(#hg1)" opacity="0.35" filter="url(#blur)" />
      <circle cx="360" cy="140" r="48" fill="#10B981" opacity="0.25" filter="url(#blur)" />
      <rect
        x="100"
        y="72"
        width="280"
        height="200"
        rx="28"
        fill="white"
        className="dark:fill-card"
        stroke="url(#hg1)"
        strokeWidth="2"
      />
      <rect x="124" y="96" width="120" height="12" rx="6" fill="url(#hg1)" opacity="0.25" />
      <rect x="124" y="120" width="200" height="8" rx="4" fill="#94a3b8" opacity="0.35" />
      <rect x="124" y="136" width="180" height="8" rx="4" fill="#94a3b8" opacity="0.25" />
      <rect x="124" y="168" width="232" height="72" rx="16" fill="url(#hg2)" opacity="0.15" />
      <path
        d="M140 200 L200 220 L260 188 L320 210"
        stroke="url(#hg1)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="140" cy="200" r="6" fill="#2563EB" />
      <circle cx="200" cy="220" r="6" fill="#7C3AED" />
      <circle cx="260" cy="188" r="6" fill="#10B981" />
      <circle cx="320" cy="210" r="6" fill="#2563EB" />
      <rect x="124" y="252" width="88" height="32" rx="10" fill="url(#hg1)" />
      <text
        x="168"
        y="273"
        textAnchor="middle"
        fill="white"
        fontSize="14"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
      >
        احجز الآن
      </text>
    </svg>
  );
}
