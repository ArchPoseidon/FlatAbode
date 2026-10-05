'use client';

import { useState } from 'react';
import BrandMark from '@/components/BrandMark';
import ScrollStory from '@/components/ScrollStory';
import LandingBackdrop from '@/components/LandingBackdrop';

type Step = 'intro' | 'count' | 'names' | 'reveal';

interface RevealedMember {
  name: string;
  slug: string;
  isCreator: boolean;
}

export default function LandingWizard({ invalidLink }: { invalidLink: boolean }) {
  const [step, setStep] = useState<Step>('intro');
  const [count, setCount] = useState<number | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<RevealedMember[]>([]);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  function chooseCount(n: number) {
    setCount(n);
    setNames(Array(n).fill(''));
    setStep('names');
  }

  function updateName(i: number, value: string) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? value : n)));
  }

  const namesValid = names.length >= 2 && names.every((n) => n.trim().length > 0);

  async function submit() {
    if (!namesValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: names.map((n) => n.trim()) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Try again.');
        return;
      }
      setMembers(data.members);
      setStep('reveal');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  function linkFor(slug: string) {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/m/${slug}`;
  }

  async function copyLink(slug: string) {
    try {
      await navigator.clipboard.writeText(linkFor(slug));
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1800);
    } catch {
      // clipboard unavailable — the link is still visible to select manually
    }
  }

  return (
    <>
    <LandingBackdrop />
    <main className="relative min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden">
      <div className="relative w-full max-w-md">
        <BrandMark className="text-center mb-8" size={step === 'intro' ? 'xl' : 'lg'} />
        {invalidLink && step === 'intro' && (
          <p className="mb-6 text-sm text-center card" style={{ borderColor: 'var(--accent)' }}>
            That link didn&apos;t match anyone. If a flatmate shared it, ask them to resend it.
          </p>
        )}

        {step === 'intro' && (
          <div className="fa-rise text-center">
            <h1 className="font-display text-5xl leading-[1.05] mb-4">
              Find your new <em className="italic">Abode</em>, together.
            </h1>
            <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>
              Your journey for looking for your new Abode, simplified.
            </p>
            <button className="btn-primary" onClick={() => setStep('count')}>
              Start your hunt
            </button>
          </div>
        )}

        {step === 'count' && (
          <div className="fa-rise text-center">
            <h2 className="font-display text-3xl mb-2">How many of you are looking together?</h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              Include yourself. You can add up to 6.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => chooseCount(n)}
                  className="w-16 h-16 rounded-full font-display text-xl font-medium"
                  style={{
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'names' && count && (
          <div className="fa-rise">
            <h2 className="font-display text-3xl mb-2 text-center">Who&apos;s hunting with you?</h2>
            <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
              First is you — everyone gets their own link once you continue.
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {names.map((name, i) => (
                <input
                  key={i}
                  className="input"
                  placeholder={i === 0 ? 'Your name' : `Flatmate ${i + 1}'s name`}
                  value={name}
                  maxLength={40}
                  onChange={(e) => updateName(i, e.target.value)}
                />
              ))}
            </div>
            {error && (
              <p className="text-sm mb-4" style={{ color: 'var(--accent)' }}>
                {error}
              </p>
            )}
            <div className="flex justify-center gap-3">
              <button className="btn-ghost" onClick={() => setStep('count')} disabled={submitting}>
                Back
              </button>
              <button className="btn-primary" onClick={submit} disabled={!namesValid || submitting}>
                {submitting ? 'Creating your group…' : 'Create shareable links'}
              </button>
            </div>
          </div>
        )}

        {step === 'reveal' && (
          <div>
            <h2 className="font-display text-3xl mb-2 text-center fa-rise">Here&apos;s your group.</h2>
            <p className="text-sm mb-8 text-center" style={{ color: 'var(--text-muted)' }}>
              Send each person their own link — opening it is all they need to do.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {members.map((m, i) => (
                <div
                  key={m.slug}
                  className="card fa-rise flex items-center justify-between gap-3"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {m.name}
                      {m.isCreator && (
                        <span className="ml-2 text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                      {linkFor(m.slug)}
                    </p>
                  </div>
                  <button
                    className="btn-ghost flex-shrink-0 text-sm px-4 py-2"
                    onClick={() => copyLink(m.slug)}
                  >
                    {copiedSlug === m.slug ? 'Copied' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
            {members.find((m) => m.isCreator) && (
              <div className="text-center fa-rise" style={{ animationDelay: `${members.length * 120}ms` }}>
                <a
                  href={`/m/${members.find((m) => m.isCreator)!.slug}`}
                  className="btn-primary inline-block"
                >
                  Continue as {members.find((m) => m.isCreator)!.name} →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
    {step === 'intro' && (
      <ScrollStory
        onStart={() => {
          setStep('count');
          window.scrollTo({ top: 0 });
        }}
      />
    )}
    </>
  );
}
