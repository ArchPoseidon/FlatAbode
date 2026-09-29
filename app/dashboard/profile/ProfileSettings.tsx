'use client';

import { useState } from 'react';
import { useOnboarding } from '@/lib/use-onboarding';
import type { Preferences } from '@/lib/types';
import BrandMark from '@/components/BrandMark';

export default function ProfileSettings({
  memberName,
  initial,
}: {
  memberName: string;
  initial: Preferences | null;
}) {
  const o = useOnboarding(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget_max: o.budget,
          bhk: o.bhk,
          locations: o.locations,
          must_have_amenities: o.mustHaveAmenities,
          custom_must_haves: o.customMustHaves,
          nice_to_haves: o.niceToHaves,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not save your preferences. Try again.');
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:py-16 flex justify-center">
      <div className="w-full max-w-lg">
        <BrandMark className="mb-6" />
        <a href="/dashboard" className="text-sm inline-block mb-6" style={{ color: 'var(--text-muted)' }}>
          ← Back to dashboard
        </a>
        <h1 className="font-display text-3xl mb-1">{memberName}&apos;s preferences</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          Change what matters to you — every listing gets rescored automatically when you save.
        </p>

        <div className="flex flex-col gap-8">
          <div>
            <label className="block text-sm font-medium mb-2">Monthly budget (max)</label>
            <input
              type="range"
              min={10000}
              max={100000}
              step={1000}
              value={o.budget}
              onChange={(e) => o.setBudget(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-sm mt-1" style={{ color: 'var(--accent)' }}>
              ₹{o.budget.toLocaleString('en-IN')} / month
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">BHK (pick any that work)</label>
            <div className="flex gap-2 flex-wrap">
              {o.bhkOptions.map((b) => (
                <button
                  key={b}
                  onClick={() => o.toggleBhk(b)}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    border: '1px solid var(--border)',
                    background: o.bhk.includes(b) ? 'var(--accent)' : 'var(--card)',
                    color: o.bhk.includes(b) ? 'var(--accent-foreground)' : 'var(--text-primary)',
                  }}
                >
                  {b} BHK
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred areas</label>
            <input
              className="input"
              placeholder="Type to search Bangalore localities…"
              value={o.locationQuery}
              onChange={(e) => o.setLocationQuery(e.target.value)}
            />
            {o.suggestions.length > 0 && (
              <div className="mt-2 card p-2 flex flex-col gap-1">
                {o.suggestions.map((s) => (
                  <button
                    key={s}
                    className="text-left px-3 py-2 rounded-lg text-sm"
                    onClick={() => o.addLocation(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {o.locations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {o.locations.map((l) => (
                  <span
                    key={l}
                    className="text-sm px-3 py-1 rounded-full flex items-center gap-2"
                    style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                  >
                    {l}
                    <button onClick={() => o.removeLocation(l)} aria-label={`Remove ${l}`}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Non-negotiables</label>
            <div className="flex flex-wrap gap-2">
              {o.amenityOptions.map((a) => (
                <button
                  key={a.key}
                  onClick={() => o.toggleAmenity(a.key)}
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    border: '1px solid var(--border)',
                    background: o.mustHaveAmenities.includes(a.key) ? 'var(--accent)' : 'var(--card)',
                    color: o.mustHaveAmenities.includes(a.key) ? 'var(--accent-foreground)' : 'var(--text-primary)',
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Other dealbreakers</label>
            <div className="flex gap-2">
              <input
                className="input"
                placeholder="e.g. no ground floor, west-facing balcony"
                value={o.customMustHave}
                onChange={(e) => o.setCustomMustHave(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && o.addCustomMustHave()}
              />
              <button className="btn-ghost flex-shrink-0" onClick={o.addCustomMustHave}>
                Add
              </button>
            </div>
            {o.customMustHaves.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {o.customMustHaves.map((c) => (
                  <span
                    key={c}
                    className="text-sm px-3 py-1 rounded-full flex items-center gap-2"
                    style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}
                  >
                    {c}
                    <button onClick={() => o.removeCustomMustHave(c)} aria-label={`Remove ${c}`}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Nice-to-haves</label>
            <div className="grid grid-cols-3 gap-3">
              {o.niceToHaveTiles.map((t) => {
                const selected = o.niceToHaves.includes(t.key);
                return (
                  <button
                    key={t.key}
                    onClick={() => o.toggleNiceToHave(t.key)}
                    className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 text-center px-2"
                    style={{
                      border: selected ? '2px solid var(--accent)' : '1px solid var(--border)',
                      background: selected ? 'var(--accent-soft)' : 'var(--card)',
                    }}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm mt-6" style={{ color: 'var(--accent)' }}>
            {error}
          </p>
        )}

        <div className="flex items-center gap-4 mt-10">
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span style={{ color: 'var(--success)' }}>Saved ✓</span>}
        </div>
      </div>
    </main>
  );
}
