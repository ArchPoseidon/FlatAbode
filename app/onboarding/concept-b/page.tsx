'use client';

import { useOnboardingDemo, DEMO_STEPS } from '@/lib/use-onboarding-demo';

const GRADIENTS = [
  'linear-gradient(160deg, #2b3b30 0%, #557a63 100%)',
  'linear-gradient(160deg, #2e3a4d 0%, #5b7a9e 100%)',
  'linear-gradient(160deg, #4a2f2b 0%, #a8654e 100%)',
  'linear-gradient(160deg, #33283f 0%, #6f5a8c 100%)',
  'linear-gradient(160deg, #3a3a2b 0%, #8c8256 100%)',
  'linear-gradient(160deg, #24343c 0%, #4a7a82 100%)',
];

const STEP_TITLES: Record<string, string> = {
  welcome: 'Find your Abode',
  priorities: 'Set your priorities',
  'must-haves': 'What can’t you live without',
  'nice-to-haves': 'Pick what you’d love',
  review: 'Ready to go',
};

export default function ConceptB() {
  const o = useOnboardingDemo();

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5 py-12"
      style={{ background: '#141210' }}
    >
      <div className="w-full max-w-sm">
        {o.step !== 'welcome' && (
          <div className="flex gap-1.5 mb-6 justify-center">
            {DEMO_STEPS.slice(1).map((s, i) => (
              <span
                key={s}
                className="h-1.5 rounded-full flex-1"
                style={{ background: i <= o.stepIndex - 1 ? '#e8dfd0' : '#3a352f' }}
              />
            ))}
          </div>
        )}

        <div
          className="rounded-[2rem] p-7 text-white relative overflow-hidden fa-rise"
          key={o.step}
          style={{ background: GRADIENTS[o.stepIndex % GRADIENTS.length], minHeight: 420 }}
        >
          <p className="text-xs uppercase tracking-widest opacity-70 mb-2">Bangalore</p>
          <h1 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-fraunces)' }}>
            {STEP_TITLES[o.step]}
          </h1>

          {o.step === 'welcome' && (
            <div>
              <p className="text-sm opacity-85 mb-8">
                Swipe through a few quick picks — budget, must-haves and the little extras — and
                we&apos;ll match it against what your group wants too.
              </p>
              <button
                className="rounded-full bg-white text-black font-semibold px-6 py-3 text-sm"
                onClick={o.next}
              >
                Let&apos;s go →
              </button>
            </div>
          )}

          {o.step === 'priorities' && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-sm opacity-85 mb-2">Monthly budget</p>
                <p className="text-3xl font-semibold mb-2">₹{o.budget.toLocaleString('en-IN')}</p>
                <input
                  type="range"
                  min={10000}
                  max={100000}
                  step={1000}
                  value={o.budget}
                  onChange={(e) => o.setBudget(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {o.bhkOptions.map((b) => (
                  <button
                    key={b}
                    onClick={() => o.setBhk(b)}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: o.bhk === b ? 'white' : 'rgba(255,255,255,0.15)',
                      color: o.bhk === b ? '#141210' : 'white',
                    }}
                  >
                    {b} BHK
                  </button>
                ))}
              </div>
              <div>
                <input
                  className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-white/60"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                  placeholder="Search an area…"
                  value={o.locationQuery}
                  onChange={(e) => o.setLocationQuery(e.target.value)}
                />
                {o.suggestions.length > 0 && (
                  <div className="mt-2 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    {o.suggestions.map((s) => (
                      <button
                        key={s}
                        className="block w-full text-left px-4 py-2 text-sm"
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
                        className="text-xs px-3 py-1 rounded-full flex items-center gap-2"
                        style={{ background: 'rgba(255,255,255,0.25)' }}
                      >
                        {l}
                        <button onClick={() => o.removeLocation(l)}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {o.step === 'must-haves' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                {o.amenityOptions.map((a) => (
                  <button
                    key={a.key}
                    onClick={() => o.toggleAmenity(a.key)}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{
                      background: o.mustHaveAmenities.includes(a.key) ? 'white' : 'rgba(255,255,255,0.15)',
                      color: o.mustHaveAmenities.includes(a.key) ? '#141210' : 'white',
                    }}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-xl px-4 py-3 text-sm text-white placeholder-white/60"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                  placeholder="Type a dealbreaker + Enter"
                  value={o.customMustHave}
                  onChange={(e) => o.setCustomMustHave(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && o.addCustomMustHave()}
                />
              </div>
              {o.customMustHaves.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {o.customMustHaves.map((c) => (
                    <span
                      key={c}
                      className="text-xs px-3 py-1 rounded-full flex items-center gap-2"
                      style={{ background: 'rgba(255,255,255,0.25)' }}
                    >
                      {c}
                      <button onClick={() => o.removeCustomMustHave(c)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {o.step === 'nice-to-haves' && (
            <div className="grid grid-cols-2 gap-3">
              {o.niceToHaveTiles.map((t) => {
                const selected = o.niceToHaves.includes(t.key);
                return (
                  <button
                    key={t.key}
                    onClick={() => o.toggleNiceToHave(t.key)}
                    className="rounded-2xl p-4 flex flex-col items-start gap-2 text-left"
                    style={{
                      background: selected ? 'white' : 'rgba(255,255,255,0.12)',
                      color: selected ? '#141210' : 'white',
                    }}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="text-sm font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {o.step === 'review' && (
            <div className="text-sm flex flex-col gap-3 opacity-90">
              <p>
                ₹{o.budget.toLocaleString('en-IN')} · {o.bhk} BHK
              </p>
              <p>{o.locations.join(', ') || 'Anywhere in Bangalore'}</p>
              <p>{[...o.mustHaveAmenities, ...o.customMustHaves].join(', ') || 'No must-haves set'}</p>
              <p>{o.niceToHaves.join(', ') || 'No nice-to-haves selected'}</p>
            </div>
          )}
        </div>

        {o.step !== 'welcome' && (
          <div className="flex justify-between mt-6">
            <button className="text-white/70 text-sm font-medium px-4 py-2" onClick={o.back}>
              Back
            </button>
            {o.step !== 'review' ? (
              <button
                className="rounded-full bg-white text-black font-semibold px-6 py-3 text-sm"
                onClick={o.next}
              >
                Next
              </button>
            ) : (
              <button className="rounded-full bg-white/40 text-white font-semibold px-6 py-3 text-sm" disabled>
                Finish (demo)
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
