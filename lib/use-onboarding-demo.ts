'use client';

import { useMemo, useState } from 'react';
import { BANGALORE_LOCALITIES } from './bangalore-localities';
import { MUST_HAVE_AMENITIES, NICE_TO_HAVE_TILES, BHK_OPTIONS } from './types';

export type DemoStep = 'welcome' | 'priorities' | 'must-haves' | 'nice-to-haves' | 'review';

export const DEMO_STEPS: DemoStep[] = ['welcome', 'priorities', 'must-haves', 'nice-to-haves', 'review'];

export function useOnboardingDemo() {
  const [step, setStep] = useState<DemoStep>('welcome');
  const [budget, setBudget] = useState(35000);
  const [bhk, setBhk] = useState<string>('2');
  const [locationQuery, setLocationQuery] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [mustHaveAmenities, setMustHaveAmenities] = useState<string[]>([]);
  const [customMustHave, setCustomMustHave] = useState('');
  const [customMustHaves, setCustomMustHaves] = useState<string[]>([]);
  const [niceToHaves, setNiceToHaves] = useState<string[]>([]);

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

  const stepIndex = DEMO_STEPS.indexOf(step);

  function next() {
    const i = DEMO_STEPS.indexOf(step);
    if (i < DEMO_STEPS.length - 1) setStep(DEMO_STEPS[i + 1]);
  }

  function back() {
    const i = DEMO_STEPS.indexOf(step);
    if (i > 0) setStep(DEMO_STEPS[i - 1]);
  }

  return {
    step,
    setStep,
    stepIndex,
    next,
    back,
    budget,
    setBudget,
    bhk,
    setBhk,
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
