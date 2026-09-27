// Full-bleed rendered scene used behind the landing/reveal screens and the dashboard.
// No external photos are fetched — this is an inline SVG so it always loads instantly
// and adapts to light/dark mode via CSS variables.
export default function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="fa-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fa-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-soft)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent-soft)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="1200" height="800" fill="url(#fa-sky)" />
      <circle cx="920" cy="180" r="220" fill="url(#fa-sun)" />

      {/* Far hills */}
      <path
        d="M0,660 Q200,610 400,645 T800,635 T1200,655 V800 H0 Z"
        fill="var(--border)"
        opacity="0.5"
      />
      {/* Near hills */}
      <path
        d="M0,720 Q250,675 520,710 T1000,702 T1200,720 V800 H0 Z"
        fill="var(--border)"
        opacity="0.8"
      />

      {/* A little skyline of homes on the ridge */}
      <g fill="var(--text-primary)" opacity="0.9">
        <polygon points="120,720 170,678 220,720" />
        <rect x="135" y="720" width="70" height="55" />
        <rect x="158" y="738" width="16" height="22" fill="var(--bg)" />

        <rect x="260" y="702" width="46" height="73" />
        <rect x="270" y="716" width="10" height="14" fill="var(--bg)" />
        <rect x="286" y="716" width="10" height="14" fill="var(--bg)" />

        <polygon points="960,705 1015,658 1070,705" />
        <rect x="972" y="705" width="86" height="70" />
        <rect x="1000" y="726" width="20" height="28" fill="var(--bg)" />

        <rect x="1090" y="722" width="40" height="53" />
      </g>

      {/* Cypress-style trees for warmth */}
      <g fill="var(--success)" opacity="0.8">
        <ellipse cx="340" cy="728" rx="10" ry="34" />
        <ellipse cx="1080" cy="736" rx="9" ry="28" />
        <ellipse cx="1108" cy="744" rx="8" ry="22" />
      </g>
    </svg>
  );
}
