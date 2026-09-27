import type { CSSProperties } from 'react';
import ApartmentArt from '@/components/ApartmentArt';

interface Palette {
  name: string;
  vibe: string;
  vars: {
    '--bg': string;
    '--card': string;
    '--border': string;
    '--text-primary': string;
    '--text-muted': string;
    '--accent': string;
    '--accent-soft': string;
    '--accent-foreground': string;
    '--success': string;
  };
}

const PALETTES: Palette[] = [
  {
    name: '1 · Warm Cream',
    vibe: 'Earthy terracotta on soft cream — the current direction, refined.',
    vars: {
      '--bg': '#faf6ef',
      '--card': '#ffffff',
      '--border': '#e8dfd0',
      '--text-primary': '#241f1a',
      '--text-muted': '#7a7166',
      '--accent': '#c1542d',
      '--accent-soft': '#f3e2d6',
      '--accent-foreground': '#ffffff',
      '--success': '#3f6b4a',
    },
  },
  {
    name: '2 · Soft Sage',
    vibe: 'Calm, natural, green-forward — feels grounded and fresh.',
    vars: {
      '--bg': '#f4f6f1',
      '--card': '#ffffff',
      '--border': '#dde5d6',
      '--text-primary': '#23281f',
      '--text-muted': '#6b7566',
      '--accent': '#4b7a5b',
      '--accent-soft': '#e1ebdd',
      '--accent-foreground': '#ffffff',
      '--success': '#b98b3e',
    },
  },
  {
    name: '3 · Blush Clay',
    vibe: 'Soft, warm, a little romantic — dusty rose on ivory.',
    vars: {
      '--bg': '#fbf3ef',
      '--card': '#ffffff',
      '--border': '#eddad1',
      '--text-primary': '#2b211d',
      '--text-muted': '#8a776e',
      '--accent': '#b76e5b',
      '--accent-soft': '#f1dcd3',
      '--accent-foreground': '#ffffff',
      '--success': '#5c7a63',
    },
  },
  {
    name: '4 · Cool Stone',
    vibe: 'Modern, trustworthy, a little more corporate-chic — slate blue on stone gray.',
    vars: {
      '--bg': '#f5f5f4',
      '--card': '#ffffff',
      '--border': '#e2e1dd',
      '--text-primary': '#1f2430',
      '--text-muted': '#6e7180',
      '--accent': '#3a5a78',
      '--accent-soft': '#e1e7ed',
      '--accent-foreground': '#ffffff',
      '--success': '#4c7a5e',
    },
  },
];

export default function PalettePicker() {
  return (
    <main className="min-h-screen p-6 md:p-10" style={{ background: '#f0efec' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl mb-2" style={{ color: '#1a1a1a' }}>
          Pick a palette
        </h1>
        <p className="text-sm mb-8" style={{ color: '#666' }}>
          Same layout, same illustration — just the colors change. Tell me the number or name you like.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PALETTES.map((p) => (
            <div key={p.name} className="rounded-2xl overflow-hidden" style={{ border: '1px solid #ddd' }}>
              <div style={{ ...(p.vars as CSSProperties) }}>
                {/* Mini hero mockup */}
                <div className="relative overflow-hidden" style={{ background: 'var(--bg)', height: 320 }}>
                  <ApartmentArt className="absolute inset-0 w-full h-full" />
                  <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                    <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
                      Bangalore
                    </p>
                    <h2 className="font-display text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>
                      Find your new <em className="italic">Abode</em>, together.
                    </h2>
                    <button
                      className="rounded-full font-semibold px-6 py-2.5 text-sm"
                      style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
                    >
                      Start your hunt
                    </button>
                  </div>
                </div>

                {/* Mini card mockup */}
                <div className="p-5" style={{ background: 'var(--bg)' }}>
                  <div
                    className="rounded-xl p-4 flex gap-3 items-start"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-16 h-16 rounded-lg flex-shrink-0" style={{ background: 'var(--accent-soft)' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Koramangala
                      </p>
                      <span
                        className="text-xs font-medium inline-block mt-1 px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                      >
                        2 BHK · ₹32,000/mo
                      </span>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        Bright corner flat with a small balcony.
                      </p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                      style={{ background: 'var(--success)', color: 'white' }}
                    >
                      ✓
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4" style={{ background: '#fafafa', borderTop: '1px solid #ddd' }}>
                <p className="font-semibold text-sm mb-1">{p.name}</p>
                <p className="text-xs mb-3" style={{ color: '#777' }}>
                  {p.vibe}
                </p>
                <div className="flex gap-2">
                  {Object.values(p.vars).map((hex, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full"
                      style={{ background: hex, border: '1px solid rgba(0,0,0,0.1)' }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
