'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Listing, ListingScoreRow, ListingNoteRow, Member } from '@/lib/dashboard-types';
import { MUST_HAVE_AMENITIES, NICE_TO_HAVE_TILES } from '@/lib/types';

const LABELS: Record<string, string> = Object.fromEntries([
  ...MUST_HAVE_AMENITIES.map((a) => [a.key, a.label]),
  ...NICE_TO_HAVE_TILES.map((t) => [t.key, t.label]),
  ['budget', 'Budget'],
  ['bhk', 'BHK'],
  ['locality', 'Location'],
]);

function label(key: string) {
  return LABELS[key] ?? key;
}

export default function ListingModal({
  listing,
  scores,
  notes,
  members,
  loved,
  onClose,
  onToggleLove,
  onAddNote,
}: {
  listing: Listing;
  scores: ListingScoreRow[];
  notes: ListingNoteRow[];
  members: Member[];
  loved: boolean;
  onClose: () => void;
  onToggleLove: () => void;
  onAddNote: (body: string) => Promise<void>;
}) {
  const [noteText, setNoteText] = useState('');
  const [posting, setPosting] = useState(false);
  const photos = listing.photos?.length ? listing.photos : listing.cover_photo ? [listing.cover_photo] : [];
  const memberName = (id: string) => members.find((m) => m.id === id)?.name ?? 'Someone';

  async function submitNote() {
    if (!noteText.trim()) return;
    setPosting(true);
    await onAddNote(noteText.trim());
    setNoteText('');
    setPosting(false);
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-8"
      style={{ background: 'rgba(10,8,6,0.65)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={`card-${listing.id}`}
        className="w-full md:max-w-3xl md:rounded-[1.75rem] overflow-hidden flex flex-col"
        style={{ background: 'var(--card)', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto">
          {photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto p-3" style={{ background: 'var(--bg)' }}>
              {photos.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="h-48 w-72 object-cover rounded-xl flex-shrink-0"
                />
              ))}
            </div>
          )}

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="font-display text-2xl">{listing.title || 'Untitled listing'}</h2>
              <button
                onClick={onToggleLove}
                className="w-11 h-11 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ border: '1px solid var(--border)' }}
                aria-label={loved ? 'Unlove' : 'Love'}
              >
                {loved ? '❤️' : '🤍'}
              </button>
            </div>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              {[listing.bhk ? `${listing.bhk} BHK` : null, listing.locality, listing.rent ? `₹${listing.rent.toLocaleString('en-IN')}/month` : null]
                .filter(Boolean)
                .join(' · ')}
            </p>

            {listing.description && <p className="text-sm mb-6">{listing.description}</p>}

            {listing.source_url && (
              <a
                href={listing.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm inline-block mb-6"
                style={{ color: 'var(--accent)' }}
              >
                View original listing ↗
              </a>
            )}

            <div className="flex flex-col gap-3 mb-6">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                How it stacks up, per person
              </p>
              {scores.length === 0 && (
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No one has finished onboarding yet, so this hasn&apos;t been scored.
                </p>
              )}
              {scores.map((s) => (
                <div key={s.member_id} className="rounded-xl p-3" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                  <p className="text-sm font-medium mb-1 flex items-center gap-2">
                    {memberName(s.member_id)}
                    <span style={{ color: s.must_haves_met ? 'var(--success)' : 'var(--accent)' }}>
                      {s.must_haves_met ? '✓ meets must-haves' : '✕ missing something'}
                    </span>
                  </p>
                  {s.unmet_must_haves.length > 0 && (
                    <p className="text-xs mb-1" style={{ color: 'var(--accent)' }}>
                      Doesn&apos;t meet: {s.unmet_must_haves.map(label).join(', ')}
                    </p>
                  )}
                  {s.unverified_must_haves.length > 0 && (
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                      Couldn&apos;t confirm: {s.unverified_must_haves.map(label).join(', ')}
                    </p>
                  )}
                  {s.nice_to_haves_met.length > 0 && (
                    <p className="text-xs" style={{ color: 'var(--success)' }}>
                      Bonus: {s.nice_to_haves_met.map(label).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Notes
              </p>
              {notes.map((n) => (
                <div key={n.id} className="text-sm">
                  <span className="font-medium">{memberName(n.member_id)}: </span>
                  <span style={{ color: 'var(--text-muted)' }}>{n.body}</span>
                </div>
              ))}
              <div className="flex gap-2 mt-1">
                <input
                  className="input"
                  placeholder="Add a note for the group…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitNote()}
                />
                <button className="btn-ghost flex-shrink-0" onClick={submitNote} disabled={posting}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', color: 'white' }}
          aria-label="Close"
        >
          ×
        </button>
      </motion.div>
    </motion.div>
  );
}
