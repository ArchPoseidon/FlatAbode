'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BHK_OPTIONS } from '@/lib/types';

export default function ShareProperty() {
  const router = useRouter();
  const [mode, setMode] = useState<'url' | 'manual'>('url');
  const [url, setUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualRent, setManualRent] = useState('');
  const [manualBhk, setManualBhk] = useState('2');
  const [manualLocality, setManualLocality] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submitUrl() {
    if (!url.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_type: 'url', source_url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not add that listing.');
        if (res.status === 422) setMode('manual');
        return;
      }
      setDone(true);
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitManual() {
    if (!manualTitle.trim()) {
      setError('Give it a short title.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_type: 'manual',
          title: manualTitle.trim(),
          description: manualDescription.trim() || null,
          rent: manualRent ? Number(manualRent) : null,
          bhk: manualBhk,
          locality: manualLocality.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not add that listing.');
        return;
      }
      setDone(true);
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        {done ? (
          <div className="fa-rise text-center">
            <h1 className="font-display text-3xl mb-3">Added 🎉</h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              It&apos;s on the dashboard now, scored against everyone&apos;s preferences.
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="btn-ghost"
                onClick={() => {
                  setUrl('');
                  setManualTitle('');
                  setDone(false);
                }}
              >
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
                  background: mode === 'url' ? 'var(--accent)' : 'var(--card)',
                  color: mode === 'url' ? 'var(--accent-foreground)' : 'var(--text-primary)',
                }}
                onClick={() => setMode('url')}
              >
                Paste a URL
              </button>
              <button
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  border: '1px solid var(--border)',
                  background: mode === 'manual' ? 'var(--accent)' : 'var(--card)',
                  color: mode === 'manual' ? 'var(--accent-foreground)' : 'var(--text-primary)',
                }}
                onClick={() => setMode('manual')}
              >
                Add manually
              </button>
            </div>

            {mode === 'url' ? (
              <div className="flex flex-col gap-4">
                <input
                  className="input"
                  placeholder="https://www.99acres.com/…"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                {error && (
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>
                    {error}
                  </p>
                )}
                <button className="btn-primary self-start" onClick={submitUrl} disabled={submitting}>
                  {submitting ? 'Reading listing…' : 'Add this property'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <input
                  className="input"
                  placeholder="Title, e.g. 2BHK in Indiranagar"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                />
                <div className="flex gap-3">
                  <input
                    className="input"
                    placeholder="Rent (₹/month)"
                    type="number"
                    value={manualRent}
                    onChange={(e) => setManualRent(e.target.value)}
                  />
                  <select
                    className="input"
                    value={manualBhk}
                    onChange={(e) => setManualBhk(e.target.value)}
                  >
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
                  value={manualLocality}
                  onChange={(e) => setManualLocality(e.target.value)}
                />
                <textarea
                  className="input"
                  placeholder="Anything worth noting — floor, condition, why you liked it…"
                  rows={3}
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                />
                {error && (
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>
                    {error}
                  </p>
                )}
                <button className="btn-primary self-start" onClick={submitManual} disabled={submitting}>
                  {submitting ? 'Adding…' : 'Add this property'}
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
