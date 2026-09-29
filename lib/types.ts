export interface Member {
  id: string;
  group_id: string;
  name: string;
  slug: string;
  is_creator: boolean;
  onboarded_at: string | null;
  created_at: string;
}

export interface Preferences {
  member_id: string;
  budget_max: number | null;
  bhk: string[];
  locations: string[];
  floor_pref: string | null;
  must_have_amenities: string[];
  custom_must_haves: string[];
  nice_to_haves: string[];
  updated_at: string;
}

export const MUST_HAVE_AMENITIES = [
  { key: 'lift', label: 'Lift' },
  { key: 'power_backup', label: 'Power backup' },
  { key: 'covered_parking', label: 'Covered parking' },
  { key: 'pet_friendly', label: 'Pet friendly' },
  { key: 'furnished', label: 'Furnished' },
  { key: 'water_supply_247', label: '24x7 water' },
] as const;

export const NICE_TO_HAVE_TILES = [
  { key: 'gym', label: 'Gym', emoji: '🏋️' },
  { key: 'swimming_pool', label: 'Pool', emoji: '🏊' },
  { key: 'balcony', label: 'Balcony', emoji: '🌇' },
  { key: 'modular_kitchen', label: 'Modular kitchen', emoji: '🍳' },
  { key: 'gated_community', label: 'Gated community', emoji: '🏘️' },
  { key: 'near_metro', label: 'Near metro', emoji: '🚇' },
  { key: 'security', label: '24x7 security', emoji: '🛡️' },
  { key: 'kids_play_area', label: "Kids' play area", emoji: '🧒' },
  { key: 'clubhouse', label: 'Clubhouse', emoji: '🎉' },
  { key: 'terrace_access', label: 'Terrace access', emoji: '🌤️' },
  { key: 'good_natural_light', label: 'Sunny / airy', emoji: '☀️' },
  { key: 'quiet_street', label: 'Quiet street', emoji: '🤫' },
] as const;

export const BHK_OPTIONS = ['1', '2', '3', '4', '4+'] as const;

const LABELS: Record<string, string> = Object.fromEntries([
  ...MUST_HAVE_AMENITIES.map((a) => [a.key, a.label]),
  ...NICE_TO_HAVE_TILES.map((t) => [t.key, t.label]),
  ['budget', 'Budget'],
  ['bhk', 'BHK'],
  ['locality', 'Location'],
]);

export function labelFor(key: string): string {
  return LABELS[key] ?? key;
}

const MUST_HAVE_KEYS = MUST_HAVE_AMENITIES.map((a) => a.key);

// Every amenity a listing's scraped data actually confirms — the must-have
// booleans that came back true, plus whichever nice-to-have keys were spotted.
export function getConfirmedAmenities(fields: Record<string, unknown>): string[] {
  return [
    ...MUST_HAVE_KEYS.filter((k) => fields[k] === true),
    ...(Array.isArray(fields.amenities) ? (fields.amenities as string[]) : []),
  ];
}

// Extraction sometimes returns "3 BHK" instead of "3" despite the prompt —
// normalize to just the leading number (or "4+") so matching stays exact.
export function normalizeBhk(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = value.match(/(\d\+?)/);
  return match ? match[1] : null;
}
