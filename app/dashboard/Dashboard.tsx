'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ListingCard from './ListingCard';
import ListingModal from './ListingModal';
import AddPropertyModal from './AddPropertyModal';
import { computeCompromises } from '@/lib/scoring';
import type { DashboardPayload, ListingScoreRow, Listing } from '@/lib/dashboard-types';

type Tab = 'all' | 'loved';

export default function Dashboard({
  initialData,
  currentMemberId,
  currentMemberName,
}: {
  initialData: DashboardPayload;
  currentMemberId: string;
  currentMemberName: string;
}) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<Tab>('all');
  const [openListingId, setOpenListingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const onboardedCount = data.members.filter((m) => m.onboarded_at).length;
  const combinedBudget = data.preferences.reduce((sum, p) => sum + (p.budget_max ?? 0), 0);

  const qualifiedIds = useMemo(() => {
    const byListing = new Map<string, ListingScoreRow[]>();
    for (const s of data.scores) {
      byListing.set(s.listing_id, [...(byListing.get(s.listing_id) ?? []), s]);
    }
    const ids = new Set<string>();
    for (const [listingId, rows] of byListing) {
      if (rows.length >= onboardedCount && onboardedCount > 0 && rows.every((r) => r.must_haves_met)) {
        ids.add(listingId);
      }
    }
    return ids;
  }, [data.scores, onboardedCount]);

  const lovedIds = useMemo(
    () => new Set(data.reactions.filter((r) => r.member_id === currentMemberId && r.loved).map((r) => r.listing_id)),
    [data.reactions, currentMemberId]
  );

  // Per listing, which onboarded members would be giving up a nice-to-have they wanted.
  const compromisesByListing = useMemo(() => {
    const map = new Map<string, { name: string; missing: string[] }[]>();
    for (const score of data.scores) {
      const prefs = data.preferences.find((p) => p.member_id === score.member_id);
      const member = data.members.find((m) => m.id === score.member_id);
      if (!prefs || !member || prefs.nice_to_haves.length === 0) continue;
      const missing = computeCompromises(prefs.nice_to_haves, score.nice_to_haves_met);
      if (missing.length === 0) continue;
      const list = map.get(score.listing_id) ?? [];
      list.push({ name: member.name, missing });
      map.set(score.listing_id, list);
    }
    return map;
  }, [data.scores, data.preferences, data.members]);

  const readyListings = data.listings.filter((l) => l.status === 'ready');
  const visibleListings =
    tab === 'all' ? readyListings.filter((l) => qualifiedIds.has(l.id)) : readyListings.filter((l) => lovedIds.has(l.id));

  const openListing = openListingId ? data.listings.find((l) => l.id === openListingId) ?? null : null;

  async function toggleLove(listingId: string) {
    const currentlyLoved = lovedIds.has(listingId);
    setData((prev) => ({
      ...prev,
      reactions: [
        ...prev.reactions.filter((r) => !(r.listing_id === listingId && r.member_id === currentMemberId)),
        { listing_id: listingId, member_id: currentMemberId, loved: !currentlyLoved, updated_at: new Date().toISOString() },
      ],
    }));
    await fetch('/api/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, loved: !currentlyLoved }),
    });
  }

  async function addNote(listingId: string, body: string) {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listing_id: listingId, body }),
    });
    const json = await res.json();
    if (json.note) {
      setData((prev) => ({ ...prev, notes: [...prev.notes, json.note] }));
    }
  }

  function handleAdded(listing: Listing) {
    setData((prev) => ({ ...prev, listings: [listing, ...prev.listings] }));
    fetch('/api/listings')
      .then((r) => r.json())
      .then((fresh) => setData((prev) => ({ ...prev, scores: fresh.scores ?? prev.scores })))
      .catch(() => {});
  }

  return (
    <div className="relative min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <aside
        className="relative z-10 w-60 flex-shrink-0 hidden md:flex flex-col justify-between p-6"
        style={{ borderRight: '1px solid var(--border)', background: 'var(--bg)' }}
      >
        <div>
          <p className="font-display text-xl mb-8">FlatAbode</p>
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setTab('all')}
              className="text-left px-3 py-2 rounded-xl text-sm font-medium"
              style={{
                background: tab === 'all' ? 'var(--accent-soft)' : 'transparent',
                color: tab === 'all' ? 'var(--accent)' : 'var(--text-primary)',
              }}
            >
              All properties
            </button>
            <button
              onClick={() => setTab('loved')}
              className="text-left px-3 py-2 rounded-xl text-sm font-medium"
              style={{
                background: tab === 'loved' ? 'var(--accent-soft)' : 'transparent',
                color: tab === 'loved' ? 'var(--accent)' : 'var(--text-primary)',
              }}
            >
              Loved
            </button>
            <a
              href="/dashboard/profile"
              className="text-left px-3 py-2 rounded-xl text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Profile
            </a>
          </nav>
        </div>
        <div>
          <button className="btn-primary block w-full text-center mb-4 text-sm" onClick={() => setShowAddModal(true)}>
            + Add a property
          </button>
          <a
            href="/api/logout"
            className="text-xs hover:underline"
            style={{ color: 'var(--text-muted)' }}
            title="Log out"
          >
            {currentMemberName} · Log out
          </a>
        </div>
      </aside>

      <main className="relative z-10 flex-1 flex flex-col">
        <div className="p-6 md:p-10">
          <h1 className="font-display text-3xl mb-1">
            {tab === 'all' ? 'Properties everyone agrees on' : 'Properties you loved'}
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            {onboardedCount < data.members.length
              ? `${data.members.length - onboardedCount} of your group still haven't finished onboarding.`
              : `Matched across all ${onboardedCount} of you · Combined budget ₹${combinedBudget.toLocaleString('en-IN')}/month`}
          </p>

          {visibleListings.length === 0 ? (
            <div className="card max-w-md">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {tab === 'all'
                  ? 'Nothing qualifies for everyone yet — add a property to get started.'
                  : "You haven't loved anything yet — tap the heart on a card to save it here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {visibleListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  loved={lovedIds.has(listing.id)}
                  qualifies={qualifiedIds.has(listing.id)}
                  compromises={compromisesByListing.get(listing.id) ?? []}
                  onOpen={() => setOpenListingId(listing.id)}
                  onToggleLove={() => toggleLove(listing.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {openListing && (
          <ListingModal
            listing={openListing}
            scores={data.scores.filter((s) => s.listing_id === openListing.id)}
            notes={data.notes.filter((n) => n.listing_id === openListing.id)}
            members={data.members}
            loved={lovedIds.has(openListing.id)}
            onClose={() => setOpenListingId(null)}
            onToggleLove={() => toggleLove(openListing.id)}
            onAddNote={(body) => addNote(openListing.id, body)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddModal && <AddPropertyModal onClose={() => setShowAddModal(false)} onAdded={handleAdded} />}
      </AnimatePresence>
    </div>
  );
}
