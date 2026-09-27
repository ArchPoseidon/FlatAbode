// Simple, calm fallback shown on a listing card/modal when no real photo could be fetched.
// Deliberately plain — a soft gradient wash with a single minimal building glyph, not a busy scene.
export default function CoverPlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--bg) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <rect x="14" y="10" width="44" height="52" rx="6" stroke="var(--accent)" strokeWidth="2.5" opacity="0.55" />
        <rect x="24" y="22" width="8" height="8" rx="1.5" fill="var(--accent)" opacity="0.4" />
        <rect x="40" y="22" width="8" height="8" rx="1.5" fill="var(--accent)" opacity="0.4" />
        <rect x="24" y="38" width="8" height="8" rx="1.5" fill="var(--accent)" opacity="0.4" />
        <rect x="40" y="38" width="8" height="8" rx="1.5" fill="var(--accent)" opacity="0.4" />
        <rect x="30" y="52" width="12" height="10" rx="1.5" fill="var(--accent)" opacity="0.55" />
      </svg>
    </div>
  );
}
