// A single rendered "modern apartment" scene — no stock photos, no emoji.
// Pulls every color from CSS variables so it re-themes automatically with any palette.
// viewBox is centered on the building and uses xMidYMid slice so it crops sensibly
// whether it's shown tall (a full-screen hero) or short (a wide banner strip).
export default function ApartmentArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--bg)" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="fa-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fa-facade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--card)" />
          <stop offset="100%" stopColor="var(--accent-soft)" />
        </linearGradient>
        <linearGradient id="fa-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2" />
        </linearGradient>
        <filter id="fa-soft-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      <rect x="0" y="0" width="1200" height="700" fill="url(#fa-sky)" />
      <circle cx="930" cy="160" r="200" fill="url(#fa-glow)" />

      {/* Soft clouds */}
      <g filter="url(#fa-soft-blur)" opacity="0.5" fill="var(--card)">
        <ellipse cx="220" cy="110" rx="130" ry="34" />
        <ellipse cx="600" cy="70" rx="100" ry="28" />
        <ellipse cx="1020" cy="100" rx="80" ry="24" />
      </g>

      {/* Distant skyline for depth */}
      <g fill="var(--border)" opacity="0.6">
        <rect x="60" y="330" width="80" height="220" rx="4" />
        <rect x="160" y="370" width="64" height="180" rx="4" />
        <rect x="1000" y="350" width="72" height="200" rx="4" />
        <rect x="1090" y="390" width="64" height="160" rx="4" />
      </g>

      {/* Trees for warmth */}
      <g>
        <rect x="216" y="470" width="10" height="60" fill="var(--border)" />
        <circle cx="221" cy="440" r="40" fill="var(--success)" opacity="0.85" />
        <rect x="980" y="490" width="8" height="50" fill="var(--border)" />
        <circle cx="984" cy="465" r="32" fill="var(--success)" opacity="0.85" />
      </g>

      {/* Main apartment building, vertically centered */}
      <g>
        <rect x="330" y="210" width="540" height="370" rx="18" fill="url(#fa-facade)" stroke="var(--border)" />
        {/* roofline accent */}
        <rect x="330" y="210" width="540" height="14" rx="7" fill="var(--accent)" />

        {/* Window grid: 4 rows x 5 cols */}
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4].map((col) => {
            const x = 358 + col * 100;
            const y = 250 + row * 80;
            const hasBalcony = (row === 1 || row === 2) && (col === 1 || col === 3);
            return (
              <g key={`${row}-${col}`}>
                <rect x={x} y={y} width="72" height="54" rx="6" fill="url(#fa-glass)" stroke="var(--border)" />
                <rect x={x + 6} y={y + 6} width="26" height="18" rx="2" fill="var(--card)" opacity="0.5" />
                {hasBalcony && (
                  <g>
                    <rect x={x - 8} y={y + 56} width="88" height="10" rx="2" fill="var(--border)" />
                    <rect x={x - 8} y={y + 56} width="88" height="26" fill="none" stroke="var(--border)" strokeWidth="2" />
                    <circle cx={x + 14} cy={y + 60} r="7" fill="var(--success)" />
                    <circle cx={x + 26} cy={y + 58} r="5" fill="var(--success)" opacity="0.8" />
                  </g>
                )}
              </g>
            );
          })
        )}

        {/* Entrance */}
        <rect x="558" y="522" width="84" height="58" rx="6" fill="var(--accent)" opacity="0.85" />
        <rect x="540" y="506" width="120" height="16" rx="8" fill="var(--card)" stroke="var(--border)" />
      </g>

      {/* Foreground ground wash */}
      <path d="M0,600 Q300,585 600,600 T1200,600 V700 H0 Z" fill="var(--bg)" opacity="0.9" />
    </svg>
  );
}
