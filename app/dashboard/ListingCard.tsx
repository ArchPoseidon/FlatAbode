'use client';

import { motion } from 'framer-motion';
import type { Listing } from '@/lib/dashboard-types';

export default function ListingCard({
  listing,
  loved,
  qualifies,
  onOpen,
  onToggleLove,
}: {
  listing: Listing;
  loved: boolean;
  qualifies: boolean;
  onOpen: () => void;
  onToggleLove: () => void;
}) {
  return (
    <motion.div
      layoutId={`card-${listing.id}`}
      className="card overflow-hidden cursor-pointer p-0 flex flex-col"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="relative w-full aspect-[4/3]" style={{ background: 'var(--accent-soft)' }}>
        {listing.cover_photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.cover_photo} alt={listing.title ?? ''} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🏠</div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLove();
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          aria-label={loved ? 'Unlove' : 'Love'}
        >
          {loved ? '❤️' : '🤍'}
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
        <p className="font-semibold leading-tight">
          {listing.title || listing.locality || 'Untitled listing'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          {[listing.bhk ? `${listing.bhk} BHK` : null, listing.locality, listing.rent ? `₹${listing.rent.toLocaleString('en-IN')}/mo` : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
    </motion.div>
  );
}
