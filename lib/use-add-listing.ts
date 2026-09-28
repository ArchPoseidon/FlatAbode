'use client';

import { useState } from 'react';
import { BHK_OPTIONS } from './types';
import type { Listing } from './dashboard-types';

export function useAddListing(onAdded?: (listing: Listing) => void) {
  const [mode, setMode] = useState<'url' | 'manual'>('url');
  const [url, setUrl] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualRent, setManualRent] = useState('');
  const [manualBhk, setManualBhk] = useState<string>(BHK_OPTIONS[1]);
  const [manualLocality, setManualLocality] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function reset() {
    setUrl('');
    setManualTitle('');
    setManualDescription('');
    setManualRent('');
    setManualBhk(BHK_OPTIONS[1]);
    setManualLocality('');
    setManualUrl('');
    setError(null);
    setDone(false);
    setMode('url');
  }

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
        if (res.status === 422) {
          setManualUrl(url.trim());
          setMode('manual');
        }
        return;
      }
      setDone(true);
      onAdded?.(data.listing);
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
          source_url: manualUrl.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not add that listing.');
        return;
      }
      setDone(true);
      onAdded?.(data.listing);
    } catch {
      setError('Could not reach the server. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return {
    mode,
    setMode,
    url,
    setUrl,
    manualTitle,
    setManualTitle,
    manualDescription,
    setManualDescription,
    manualRent,
    setManualRent,
    manualBhk,
    setManualBhk,
    manualLocality,
    setManualLocality,
    manualUrl,
    setManualUrl,
    submitting,
    error,
    done,
    reset,
    submitUrl,
    submitManual,
  };
}
