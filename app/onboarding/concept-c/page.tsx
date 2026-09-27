'use client';

import { useOnboardingDemo, DEMO_STEPS } from '@/lib/use-onboarding-demo';

const STEP_TITLES: Record<string, [string, string]> = {
  welcome: ['Find your', 'next Abode.'],
  priorities: ['Set your', 'priorities.'],
  'must-haves': ['Name your', 'non-negotiables.'],
  'nice-to-haves': ['A few nice', 'extras, maybe.'],
  review: ['You’re', 'all set.'],
};

const CAPTIONS: Record<string, string> = {
  welcome: 'Hunt fast. Settle slow.',
  priorities: 'Budget, size, and where in Bangalore.',
  'must-haves': 'What this flat absolutely needs.',
  'nice-to-haves': 'Bonus points, not dealbreakers.',
  review: 'Shared with your group, instantly.',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <p className="text-xs uppercase tracking-[0.15em] mb-3 text-white/50">{label}</p>
      {children}
    </div>
  );
}

export default function ConceptC() {
  const o = useOnboardingDemo();
  const [line1, line2] = STEP_TITLES[o.step];

  return (
    <main className="min-h-screen flex" style={{ background: '#0b0b0c', color: '#f3ede2' }}>
      <div className="flex-1 flex flex-col justify-center px-8 py-16 md:px-16 max-w-2xl">
        {o.step !== 'welcome' && (
          <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-10">
            {String(o.stepIndex).padStart(2, '0')} / {String(DEMO_STEPS.length - 1).padStart(2, '0')}
          </p>
        )}

        <h1 className="mb-4 leading-[1.05] fa-rise" key={o.step} style={{ fontFamily: 'var(--font-fraunces)' }}>
          <span className="block text-5xl md:text-6xl font-medium">{line1}</span>
          <span className="block text-5xl md:text-6xl italic font-medium text-white/60">{line2}</span>
        </h1>
        <p className="text-sm text-white/50 mb-12">{CAPTIONS[o.step]}</p>

        {o.step === 'welcome' && (
          <button
            className="self-start rounded-full border border-white/30 px-7 py-3 text-sm font-medium hover:bg-white hover:text-black transition-colors"
            onClick={o.next}
          >
            Begin
          </button>
        )}

        {o.step === 'priorities' && (
          <div className="fa-rise">
            <Field label="Monthly budget">
              <p className="text-2xl mb-2">₹{o.budget.toLocaleString('en-IN')}</p>
              <input
                type="range"
                min={10000}
                max={100000}
                step={1000}
                value={o.budget}
                onChange={(e) => o.setBudget(Number(e.target.value))}
                className="w-full max-w-sm"
              />
            </Field>
            <Field label="BHK">
              <div className="flex gap-2 flex-wrap">
                {o.bhkOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => o.setBhk(b)}
                    className="px-4 py-2 rounded-full text-sm border"
                    style={{
                      borderColor: o.bhk === b ? '#f3ede2' : 'rgba(255,255,255,0.2)',
                      background: o.bhk === b ? '#f3ede2' : 'transparent',
                      color: o.bhk === b ? '#0b0b0c' : '#f3ede2',
                    }}
                  >
                    {b} BHK
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Areas">
              <input
                className="bg-transparent border-b border-white/25 pb-2 text-sm w-full max-w-sm focus:outline-none focus:border-white/70"
                placeholder="Type to search…"
                value={o.locationQuery}
                onChange={(e) => o.setLocationQuery(e.target.value)}
              />
              {o.suggestions.length > 0 && (
                <div className="mt-2 flex flex-col gap-1 max-w-sm">
                  {o.suggestions.map((s) => (
                    <button
                      key={s}
                      className="text-left text-sm text-white/70 hover:text-white py-1"
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
                    <span key={l} className="text-xs px-3 py-1 rounded-full border border-white/25 flex items-center gap-2">
                      {l}
                      <button onClick={() => o.removeLocation(l)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>
        )}

        {o.step === 'must-haves' && (
          <div className="fa-rise">
            <Field label="Non-negotiables">
              <div className="flex flex-wrap gap-2">
                {o.amenityOptions.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => o.toggleAmenity(a.key)}
                    className="px-4 py-2 rounded-full text-sm border"
                    style={{
                      borderColor: o.mustHaveAmenities.includes(a.key) ? '#f3ede2' : 'rgba(255,255,255,0.2)',
                      background: o.mustHaveAmenities.includes(a.key) ? '#f3ede2' : 'transparent',
                      color: o.mustHaveAmenities.includes(a.key) ? '#0b0b0c' : '#f3ede2',
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Anything else">
              <input
                className="bg-transparent border-b border-white/25 pb-2 text-sm w-full max-w-sm focus:outline-none focus:border-white/70"
                placeholder="Type + Enter to add"
                value={o.customMustHave}
                onChange={(e) => o.setCustomMustHave(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && o.addCustomMustHave()}
              />
              {o.customMustHaves.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {o.customMustHaves.map((c) => (
                    <span key={c} className="text-xs px-3 py-1 rounded-full border border-white/25 flex items-center gap-2">
                      {c}
                      <button onClick={() => o.removeCustomMustHave(c)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>
        )}

        {o.step === 'nice-to-haves' && (
          <div className="grid grid-cols-3 gap-2 max-w-lg fa-rise">
            {o.niceToHaveTiles.map((t) => {
              const selected = o.niceToHaves.includes(t.key);
              return (
                <button
                  key={t.key}
                  onClick={() => o.toggleNiceToHave(t.key)}
                  className="rounded-xl border p-3 flex flex-col items-center gap-1 text-center"
                  style={{
                    borderColor: selected ? '#f3ede2' : 'rgba(255,255,255,0.15)',
                    background: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
                  }}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {o.step === 'review' && (
          <div className="fa-rise text-sm text-white/70 flex flex-col gap-2 max-w-sm">
            <p>₹{o.budget.toLocaleString('en-IN')} · {o.bhk} BHK</p>
            <p>{o.locations.join(', ') || 'Anywhere in Bangalore'}</p>
            <p>{[...o.mustHaveAmenities, ...o.customMustHaves].join(', ') || 'No must-haves set'}</p>
            <p>{o.niceToHaves.join(', ') || 'No nice-to-haves selected'}</p>
          </div>
        )}

        {o.step !== 'welcome' && (
          <div className="flex gap-4 mt-12">
            <button className="text-sm text-white/50 hover:text-white" onClick={o.back}>
              ← Back
            </button>
            {o.step !== 'review' ? (
              <button
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium hover:bg-white hover:text-black transition-colors"
                onClick={o.next}
              >
                Continue
              </button>
            ) : (
              <button className="rounded-full border border-white/15 px-7 py-3 text-sm font-medium text-white/40" disabled>
                Finish (demo)
              </button>
            )}
          </div>
        )}
      </div>

      <div className="hidden md:block flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 30% 20%, rgba(193,84,45,0.35), transparent 55%), radial-gradient(circle at 70% 80%, rgba(63,107,74,0.3), transparent 55%), #111',
          }}
        />
      </div>
    </main>
  );
}
