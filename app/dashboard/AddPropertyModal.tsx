'use client';

import { motion } from 'framer-motion';
import { useAddListing } from '@/lib/use-add-listing';
import { BHK_OPTIONS } from '@/lib/types';
import UrlTip from '@/components/UrlTip';
import type { Listing } from '@/lib/dashboard-types';

export default function AddPropertyModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (listing: Listing) => void;
}) {
  const o = useAddListing((listing) => onAdded(listing));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-8"
      style={{ background: 'rgba(10,8,6,0.65)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-lg md:rounded-[1.75rem] overflow-y-auto p-6 md:p-8"
        style={{ background: 'var(--card)', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {o.done ? (
          <div className="fa-rise text-center py-6">
            <h2 className="font-display text-2xl mb-2">Added</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              It&apos;s on the dashboard now, scored against everyone&apos;s preferences.
            </p>
            <div className="flex justify-center gap-3">
              <button className="btn-ghost" onClick={o.reset}>
                Add another
              </button>
              <button className="btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4 mb-1">
              <h2 className="font-display text-2xl">Add a property</h2>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: '1px solid var(--border)' }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Paste a link and we&apos;ll pull the details in automatically.
            </p>

            <div className="flex gap-2 mb-6">
              <button
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  border: '1px solid var(--border)',
                  background: o.mode === 'url' ? 'var(--accent)' : 'var(--bg)',
                  color: o.mode === 'url' ? 'var(--accent-foreground)' : 'var(--text-primary)',
                }}
                onClick={() => o.setMode('url')}
              >
                Paste a URL
              </button>
              <button
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  border: '1px solid var(--border)',
                  background: o.mode === 'manual' ? 'var(--accent)' : 'var(--bg)',
                  color: o.mode === 'manual' ? 'var(--accent-foreground)' : 'var(--text-primary)',
                }}
                onClick={() => o.setMode('manual')}
              >
                Add manually
              </button>
            </div>

            {o.mode === 'url' ? (
              <div className="flex flex-col gap-4">
                <input
                  className="input"
                  placeholder="https://www.nobroker.in/…"
                  value={o.url}
                  onChange={(e) => o.setUrl(e.target.value)}
                />
                <UrlTip />
                {o.error && (
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>
                    {o.error}
                  </p>
                )}
                <button className="btn-primary self-start" onClick={o.submitUrl} disabled={o.submitting}>
                  {o.submitting ? 'Reading listing…' : 'Add this property'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <input
                  className="input"
                  placeholder="Title, e.g. 2BHK in Indiranagar"
                  value={o.manualTitle}
                  onChange={(e) => o.setManualTitle(e.target.value)}
                />
                <div className="flex gap-3">
                  <input
                    className="input"
                    placeholder="Rent (₹/month)"
                    type="number"
                    value={o.manualRent}
                    onChange={(e) => o.setManualRent(e.target.value)}
                  />
                  <select className="input" value={o.manualBhk} onChange={(e) => o.setManualBhk(e.target.value)}>
                    {BHK_OPTIONS.map((b) => (
                      <option key={b} value={b}>
                        {b} BHK
                      </option>
                    ))}
                  </select>
                </div>
                <input
                  className="input"
                  placeholder="Locality"
                  value={o.manualLocality}
                  onChange={(e) => o.setManualLocality(e.target.value)}
                />
                <textarea
                  className="input"
                  placeholder="Anything worth noting — floor, condition, why you liked it…"
                  rows={3}
                  value={o.manualDescription}
                  onChange={(e) => o.setManualDescription(e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Original listing URL (optional)"
                  value={o.manualUrl}
                  onChange={(e) => o.setManualUrl(e.target.value)}
                />
                {o.error && (
                  <p className="text-sm" style={{ color: 'var(--accent)' }}>
                    {o.error}
                  </p>
                )}
                <button className="btn-primary self-start" onClick={o.submitManual} disabled={o.submitting}>
                  {o.submitting ? 'Adding…' : 'Add this property'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
