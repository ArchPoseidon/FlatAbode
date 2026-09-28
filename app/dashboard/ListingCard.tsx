'use client';

import { motion } from 'framer-motion';
import CoverPlaceholder from '@/components/CoverPlaceholder';
import HeartIcon from '@/components/HeartIcon';
import { labelFor, MUST_HAVE_AMENITIES } from '@/lib/types';
import type { Listing } from '@/lib/dashboard-types';

const MUST_HAVE_KEYS = MUST_HAVE_AMENITIES.map((a) => a.key);

export default function ListingCard({
  listing,
  loved,
  qualifies,
  compromises,
  onOpen,
  onToggleLove,
}: {
  listing: Listing;
  loved: boolean;
  qualifies: boolean;
  compromises: { name: string; missing: string[] }[];
  onOpen: () => void;
  onToggleLove: () => void;
}) {
  const area = listing.locality || listing.title || 'Untitled listing';
  const metadata = [
    listing.bhk ? `${listing.bhk} BHK` : null,
    listing.rent ? `₹${listing.rent.toLocaleString('en-IN')}/mo` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const fields = (listing.extracted_fields ?? {}) as Record<string, unknown>;
  const confirmedAmenities = [
    ...MUST_HAVE_KEYS.filter((k) => fields[k] === true),
    ...((Array.isArray(fields.amenities) ? (fields.amenities as string[]) : [])),
  ];

  return (
    <motion.div
      layoutId={`card-${listing.id}`}
      className="card overflow-hidden cursor-pointer p-0 flex flex-col"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="relative w-full overflow-hidden" style={{ background: 'var(--accent-soft)', aspectRatio: '16 / 7' }}>
        {listing.cover_photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.cover_photo} alt={area} className="w-full h-full object-cover" />
        ) : (
          <CoverPlaceholder className="absolute inset-0 w-full h-full" />
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLove();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', color: 'white' }}
          aria-label={loved ? 'Unlove' : 'Love'}
        >
          <HeartIcon filled={loved} />
        </button>
        {qualifies && (
          <span
            className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'var(--success)', color: 'white' }}
          >
            Matches everyone
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-display text-lg leading-tight">{listing.nickname || area}</p>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {[area, metadata].filter(Boolean).join(' · ')}
        </p>

        {confirmedAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {confirmedAmenities.map((k) => (
              <span
                key={k}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                {labelFor(k)}
              </span>
            ))}
          </div>
        )}

        {compromises.length > 0 && (
          <div className="mt-3 pt-3 flex flex-col gap-1" style={{ borderTop: '1px solid var(--border)' }}>
            {compromises.map((c) => (
              <p key={c.name} className="text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="font-medium">{c.name}</span> gives up: {c.missing.map(labelFor).join(', ')}
              </p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
