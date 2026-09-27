'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ApartmentArt from '@/components/ApartmentArt';
import ListingCard from './ListingCard';
import ListingModal from './ListingModal';
import type { DashboardPayload, ListingScoreRow } from '@/lib/dashboard-types';

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

  const onboardedCount = data.members.filter((m) => m.onboarded_at).length;

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
              Loved ❤️
            </button>
          </nav>
        </div>
        <div>
          <a href="/onboarding/share-property" className="btn-primary block text-center mb-4 text-sm">
            + Add a property
          </a>
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
        <div className="relative w-full overflow-hidden" style={{ height: 280 }}>
          <ApartmentArt className="absolute inset-0 w-full h-full" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, var(--bg) 0%, transparent 60%)' }}
          />
        </div>

        <div className="p-6 md:p-10 pt-8">
          <h1 className="font-display text-3xl mb-1">
            {tab === 'all' ? 'Properties everyone agrees on' : 'Properties you loved'}
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            {onboardedCount < data.members.length
              ? `${data.members.length - onboardedCount} of your group still haven't finished onboarding.`
              : `Matched across all ${onboardedCount} of you.`}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  loved={lovedIds.has(listing.id)}
                  qualifies={qualifiedIds.has(listing.id)}
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
    </div>
  );
}
