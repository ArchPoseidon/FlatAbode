'use client';

import { motion } from 'framer-motion';
import ApartmentArt from '@/components/ApartmentArt';
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
  const area = listing.locality || listing.title || 'Untitled listing';
  const metadata = [
    listing.bhk ? `${listing.bhk} BHK` : null,
    listing.rent ? `₹${listing.rent.toLocaleString('en-IN')}/mo` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <motion.div
      layoutId={`card-${listing.id}`}
      className="card overflow-hidden cursor-pointer p-0 flex flex-col"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden" style={{ background: 'var(--accent-soft)' }}>
        {listing.cover_photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={listing.cover_photo} alt={area} className="w-full h-full object-cover" />
        ) : (
          <ApartmentArt className="absolute inset-0 w-full h-full" />
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
        <p className="font-semibold leading-tight">{area}</p>
        {metadata && (
          <p className="text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
            {metadata}
          </p>
        )}
        {listing.description && (
          <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
            {listing.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
