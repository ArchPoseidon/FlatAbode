// A warm, dusk-lit apartment scene rendered as SVG, then dulled (soft blur, low
// saturation, cream wash) so it reads as atmosphere behind the page, not as content.
// Window lighting is deterministic so server and client render identically.

function lit(row: number, col: number, seed: number) {
  const h = (row * 31 + col * 17 + seed * 13) % 11;
  return h < 4;
}

function Block({ x, y, cols, rows, seed, tone }: { x: number; y: number; cols: number; rows: number; seed: number; tone: string }) {
  const cw = 46;
  const rh = 54;
  const w = cols * cw + 28;
  const h = rows * rh + 24;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={tone} />
      <rect x={x - 10} y={y - 14} width={w + 20} height={14} fill="#a9704f" opacity={0.85} />
      <rect x={x + w * 0.62} y={y - 46} width={46} height={32} rx={4} fill="#8d5c42" opacity={0.8} />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const on = lit(r, c, seed);
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x + 14 + c * cw}
                y={y + 12 + r * rh}
                width={30}
                height={34}
                rx={3}
                fill={on ? '#f6c46b' : '#6e4a3a'}
                opacity={on ? 0.95 : 0.55}
              />
              <rect x={x + 8 + c * cw} y={y + 12 + r * rh + 36} width={42} height={5} fill="#7a4d38" opacity={0.7} />
            </g>
          );
        })
      )}
    </g>
  );
}

export default function LandingBackdrop() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(2px) saturate(0.8)', opacity: 0.55 }}
      >
        <defs>
          <linearGradient id="lb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f1d3bd" />
            <stop offset="55%" stopColor="#f6dcc0" />
            <stop offset="100%" stopColor="#e9b98f" />
          </linearGradient>
          <radialGradient id="lb-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffd9a0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lb-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c98f6b" stopOpacity="0" />
            <stop offset="100%" stopColor="#8d5c42" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        <rect width="1600" height="900" fill="url(#lb-sky)" />
        <circle cx="1180" cy="300" r="460" fill="url(#lb-sun)" />

        {/* hazy far skyline */}
        <g fill="#b98266" opacity="0.35">
          <rect x="40" y="470" width="110" height="330" />
          <rect x="170" y="520" width="90" height="280" />
          <rect x="1330" y="480" width="120" height="320" />
          <rect x="1470" y="530" width="110" height="270" />
          <rect x="620" y="560" width="100" height="240" />
          <rect x="760" y="520" width="80" height="280" />
        </g>

        <Block x={150} y={250} cols={6} rows={9} seed={3} tone="#d3a07d" />
        <Block x={960} y={150} cols={7} rows={11} seed={7} tone="#c98f6b" />

        {/* tree masses */}
        <g fill="#6f7d5a" opacity="0.7">
          <ellipse cx="560" cy="780" rx="120" ry="95" />
          <ellipse cx="660" cy="800" rx="90" ry="70" />
          <ellipse cx="1330" cy="800" rx="130" ry="100" />
        </g>

        <rect y="700" width="1600" height="200" fill="url(#lb-ground)" />
      </svg>

      {/* cream wash keeps type readable and pushes the scene back */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(250,246,239,0.55) 0%, rgba(250,246,239,0.35) 45%, rgba(250,246,239,0.7) 100%)',
        }}
      />
    </div>
  );
}
