'use client';

import { useRouter } from 'next/navigation';
import { useAddListing } from '@/lib/use-add-listing';
import { BHK_OPTIONS } from '@/lib/types';
import UrlTip from '@/components/UrlTip';
import BrandMark from '@/components/BrandMark';

export default function ShareProperty() {
  const router = useRouter();
  const o = useAddListing();

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        <BrandMark className="text-center mb-8" />
        {o.done ? (
          <div className="fa-rise text-center">
            <h1 className="font-display text-3xl mb-3">Added</h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              It&apos;s on the dashboard now, scored against everyone&apos;s preferences.
            </p>
            <div className="flex justify-center gap-3">
              <button className="btn-ghost" onClick={o.reset}>
                Add another
              </button>
              <button className="btn-primary" onClick={() => router.push('/dashboard')}>
                Go to dashboard →
              </button>
            </div>
          </div>
        ) : (
          <div className="fa-rise">
            <h1 className="font-display text-3xl mb-2 text-center">Found a place already?</h1>
            <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
              Paste a link from any listing site and we&apos;ll pull the details in automatically.
            </p>

            <div className="flex justify-center gap-2 mb-6">
              <button
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  border: '1px solid var(--border)',
                  background: o.mode === 'url' ? 'var(--accent)' : 'var(--card)',
                  color: o.mode === 'url' ? 'var(--accent-foreground)' : 'var(--text-primary)',
                }}
                onClick={() => o.setMode('url')}
              >
                Paste a URL
              </button>
              <button
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  border: '1px solid var(--border)',
                  background: o.mode === 'manual' ? 'var(--accent)' : 'var(--card)',
                  color: o.mode === 'manual' ? 'var(--accent-foreground)' : 'var(--text-primary)',
                }}
                onClick={() => o.setMode('manual')}
              >
                Add manually
              </button>
            </div>

            {o.mode === 'url' ? (
              <div className="flex flex-col gap-4">
                <input
                  className="input"
                  placeholder="https://www.nobroker.in/…"
                  value={o.url}
                  onChange={(e) => o.setUrl(e.target.value)}
                />
                <UrlTip />
                {o.error && (
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>
                    {o.error}
                  </p>
                )}
                <button className="btn-primary self-start" onClick={o.submitUrl} disabled={o.submitting}>
                  {o.submitting ? 'Reading listing…' : 'Add this property'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <input
                  className="input"
                  placeholder="Title, e.g. 2BHK in Indiranagar"
                  value={o.manualTitle}
                  onChange={(e) => o.setManualTitle(e.target.value)}
                />
                <div className="flex gap-3">
                  <input
                    className="input"
                    placeholder="Rent (₹/month)"
                    type="number"
                    value={o.manualRent}
                    onChange={(e) => o.setManualRent(e.target.value)}
                  />
                  <select className="input" value={o.manualBhk} onChange={(e) => o.setManualBhk(e.target.value)}>
                    {BHK_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b} BHK
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  className="input"
                  placeholder="Locality"
                  value={o.manualLocality}
                  onChange={(e) => o.setManualLocality(e.target.value)}
                />
                <textarea
                  className="input"
                  placeholder="Anything worth noting — floor, condition, why you liked it…"
                  rows={3}
                  value={o.manualDescription}
                  onChange={(e) => o.setManualDescription(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Original listing URL (optional)"
                  value={o.manualUrl}
                  onChange={(e) => o.setManualUrl(e.target.value)}
                />
                {o.error && (
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>
                    {o.error}
                  </p>
                )}
                <button className="btn-primary self-start" onClick={o.submitManual} disabled={o.submitting}>
                  {o.submitting ? 'Adding…' : 'Add this property'}
                </button>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                className="text-sm"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => router.push('/dashboard')}
              >
                Skip for now →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
