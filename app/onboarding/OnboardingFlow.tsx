'use client';

import { useOnboarding, ONBOARDING_STEPS } from '@/lib/use-onboarding';
import { MUST_HAVE_AMENITIES, NICE_TO_HAVE_TILES, type Preferences } from '@/lib/types';

const LABELS: Record<string, string> = Object.fromEntries([
  ...MUST_HAVE_AMENITIES.map((a) => [a.key, a.label]),
  ...NICE_TO_HAVE_TILES.map((t) => [t.key, t.label]),
]);
const label = (key: string) => LABELS[key] ?? key;

const STEP_TITLES: Record<string, string> = {
  welcome: 'Let’s find what matters to you',
  priorities: 'Your priorities',
  'must-haves': 'Your must-haves',
  'nice-to-haves': 'Nice-to-haves',
  review: 'You’re all set',
};

export default function OnboardingFlow({
  memberName,
  initial,
}: {
  memberName: string;
  initial: Preferences | null;
}) {
  const o = useOnboarding(initial);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        {o.step !== 'welcome' && (
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
              Step {o.stepIndex} of {ONBOARDING_STEPS.length - 1}
            </p>
            <div className="h-1 rounded-full" style={{ background: 'var(--border)' }}>
              <div
                className="h-1 rounded-full"
                style={{
                  background: 'var(--accent)',
                  width: `${(o.stepIndex / (ONBOARDING_STEPS.length - 1)) * 100}%`,
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </div>
        )}

        <h1 className="font-display text-3xl mb-8 fa-rise" key={o.step}>
          {o.step === 'welcome' ? `Hi ${memberName} 👋` : STEP_TITLES[o.step]}
        </h1>

        {o.step === 'welcome' && (
          <div className="fa-rise">
            <p className="text-base mb-8" style={{ color: 'var(--text-muted)' }}>
              A few quick questions about budget, location and must-haves in Bangalore — so we only
              show your group the flats that actually work for everyone.
            </p>
            <button className="btn-primary" onClick={o.next}>
              Begin
            </button>
          </div>
        )}

        {o.step === 'priorities' && (
          <div className="fa-rise flex flex-col gap-8">
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
              <label className="block text-sm font-medium mb-2">BHK</label>
              <div className="flex gap-2 flex-wrap">
                {o.bhkOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => o.setBhk(b)}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      border: '1px solid var(--border)',
                      background: o.bhk === b ? 'var(--accent)' : 'var(--card)',
                      color: o.bhk === b ? 'var(--accent-foreground)' : 'var(--text-primary)',
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
          </div>
        )}

        {o.step === 'must-haves' && (
          <div className="fa-rise flex flex-col gap-8">
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
                      color: o.mustHaveAmenities.includes(a.key)
                        ? 'var(--accent-foreground)'
                        : 'var(--text-primary)',
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Anything else that&apos;s a dealbreaker?</label>
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
          </div>
        )}

        {o.step === 'nice-to-haves' && (
          <div className="fa-rise">
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Tap what would be nice to have — not required.
            </p>
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
        )}

        {o.step === 'review' && (
          <div className="fa-rise card">
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              Budget
            </p>
            <p className="font-medium mb-4">₹{o.budget.toLocaleString('en-IN')} · {o.bhk} BHK</p>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              Areas
            </p>
            <p className="font-medium mb-4">{o.locations.join(', ') || 'Anywhere in Bangalore'}</p>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              Must-haves
            </p>
            <p className="font-medium mb-4">
              {[...o.mustHaveAmenities.map(label), ...o.customMustHaves].join(', ') || 'None set'}
            </p>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              Nice-to-haves
            </p>
            <p className="font-medium">{o.niceToHaves.map(label).join(', ') || 'None selected'}</p>
          </div>
        )}

        {o.error && (
          <p className="text-sm mt-6" style={{ color: 'var(--accent)' }}>
            {o.error}
          </p>
        )}

        {o.step !== 'welcome' && (
          <div className="flex justify-between mt-10">
            <button className="btn-ghost" onClick={o.back} disabled={o.submitting}>
              Back
            </button>
            {o.step !== 'review' ? (
              <button className="btn-primary" onClick={o.next}>
                Continue
              </button>
            ) : (
              <button className="btn-primary" onClick={o.finish} disabled={o.submitting}>
                {o.submitting ? 'Saving…' : 'Save and continue'}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
