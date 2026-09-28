'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BANGALORE_LOCALITIES } from './bangalore-localities';
import { MUST_HAVE_AMENITIES, NICE_TO_HAVE_TILES, BHK_OPTIONS, type Preferences } from './types';

export type OnboardingStep = 'welcome' | 'priorities' | 'must-haves' | 'nice-to-haves' | 'review';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'priorities',
  'must-haves',
  'nice-to-haves',
  'review',
];

export function useOnboarding(initial: Preferences | null) {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [budget, setBudget] = useState(initial?.budget_max ?? 35000);
  const [bhk, setBhk] = useState<string[]>(initial?.bhk ?? []);
  const [locationQuery, setLocationQuery] = useState('');
  const [locations, setLocations] = useState<string[]>(initial?.locations ?? []);
  const [mustHaveAmenities, setMustHaveAmenities] = useState<string[]>(
    initial?.must_have_amenities ?? []
  );
  const [customMustHave, setCustomMustHave] = useState('');
  const [customMustHaves, setCustomMustHaves] = useState<string[]>(initial?.custom_must_haves ?? []);
  const [niceToHaves, setNiceToHaves] = useState<string[]>(initial?.nice_to_haves ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!locationQuery.trim()) return [];
    const q = locationQuery.toLowerCase();
    return BANGALORE_LOCALITIES.filter(
      (l) => l.toLowerCase().includes(q) && !locations.includes(l)
    ).slice(0, 6);
  }, [locationQuery, locations]);

  function addLocation(loc: string) {
    setLocations((prev) => (prev.includes(loc) ? prev : [...prev, loc]));
    setLocationQuery('');
  }

  function removeLocation(loc: string) {
    setLocations((prev) => prev.filter((l) => l !== loc));
  }

  function toggleBhk(key: string) {
    setBhk((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function toggleAmenity(key: string) {
    setMustHaveAmenities((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  function addCustomMustHave() {
    const v = customMustHave.trim();
    if (!v) return;
    setCustomMustHaves((prev) => [...prev, v]);
    setCustomMustHave('');
  }

  function removeCustomMustHave(v: string) {
    setCustomMustHaves((prev) => prev.filter((x) => x !== v));
  }

  function toggleNiceToHave(key: string) {
    setNiceToHaves((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  }

  const stepIndex = ONBOARDING_STEPS.indexOf(step);

  function next() {
    const i = ONBOARDING_STEPS.indexOf(step);
    if (i < ONBOARDING_STEPS.length - 1) setStep(ONBOARDING_STEPS[i + 1]);
  }

  function back() {
    const i = ONBOARDING_STEPS.indexOf(step);
    if (i > 0) setStep(ONBOARDING_STEPS[i - 1]);
  }

  async function finish() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget_max: budget,
          bhk,
          locations,
          must_have_amenities: mustHaveAmenities,
          custom_must_haves: customMustHaves,
          nice_to_haves: niceToHaves,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not save your preferences. Try again.');
        return;
      }
      router.push('/onboarding/share-property');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    step,
    setStep,
    stepIndex,
    next,
    back,
    finish,
    submitting,
    error,
    budget,
    setBudget,
    bhk,
    toggleBhk,
    bhkOptions: BHK_OPTIONS,
    locationQuery,
    setLocationQuery,
    locations,
    addLocation,
    removeLocation,
    suggestions,
    mustHaveAmenities,
    toggleAmenity,
    amenityOptions: MUST_HAVE_AMENITIES,
    customMustHave,
    setCustomMustHave,
    customMustHaves,
    addCustomMustHave,
    removeCustomMustHave,
    niceToHaves,
    toggleNiceToHave,
    niceToHaveTiles: NICE_TO_HAVE_TILES,
  };
}
