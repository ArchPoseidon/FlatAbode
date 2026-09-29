export default function BrandMark({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'text-3xl md:text-4xl' : size === 'sm' ? 'text-lg' : 'text-2xl';
  return (
    <p className={`font-display font-semibold tracking-tight ${sizeClass} ${className}`} style={{ color: 'var(--accent)' }}>
      FlatAbode
    </p>
  );
}
