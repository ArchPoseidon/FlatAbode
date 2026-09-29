import type { Preferences } from './types';

export interface ExtractedListingFields {
  rent?: number | null;
  bhk?: string | null;
  locality?: string | null;
  lift?: boolean | null;
  power_backup?: boolean | null;
  covered_parking?: boolean | null;
  pet_friendly?: boolean | null;
  furnished?: boolean | null;
  water_supply_247?: boolean | null;
  amenities?: string[] | null;
}

export interface ListingScore {
  must_haves_met: boolean;
  unmet_must_haves: string[];
  unverified_must_haves: string[];
  nice_to_haves_met: string[];
}

export function scoreListing(
  prefs: Preferences,
  fields: ExtractedListingFields,
  groupBudgetMax: number | null
): ListingScore {
  const unmet: string[] = [];
  const unverified: string[] = [];

  // Budget is a shared, pooled constraint (everyone splits the rent), not an
  // individual one — so rent is checked against the sum of the group's
  // budgets, not any one member's number alone.
  if (groupBudgetMax != null) {
    if (fields.rent == null) unverified.push('budget');
    else if (fields.rent > groupBudgetMax) unmet.push('budget');
  }

  if (prefs.bhk.length > 0) {
    if (!fields.bhk) unverified.push('bhk');
    else if (!prefs.bhk.includes(fields.bhk)) unmet.push('bhk');
  }

  if (prefs.locations.length > 0) {
    if (!fields.locality) unverified.push('locality');
    else {
      const locality = fields.locality.toLowerCase();
      const matches = prefs.locations.some(
        (l) => locality.includes(l.toLowerCase()) || l.toLowerCase().includes(locality)
      );
      if (!matches) unmet.push('locality');
    }
  }

  for (const amenity of prefs.must_have_amenities) {
    const value = (fields as Record<string, unknown>)[amenity];
    if (value === true) continue;
    if (value === false) unmet.push(amenity);
    else unverified.push(amenity);
  }

  // Freeform must-haves can't be verified against structured fields — flag, never auto-fail.
  for (const custom of prefs.custom_must_haves) {
    unverified.push(custom);
  }

  const niceToHavesMet = (fields.amenities ?? []).filter((a) => prefs.nice_to_haves.includes(a));

  return {
    must_haves_met: unmet.length === 0,
    unmet_must_haves: unmet,
    unverified_must_haves: unverified,
    nice_to_haves_met: niceToHavesMet,
  };
}

// What a member wanted as a nice-to-have that this listing doesn't confirm —
// framed as what they'd be compromising on to live here.
export function computeCompromises(memberNiceToHaves: string[], niceToHavesMet: string[]): string[] {
  return memberNiceToHaves.filter((k) => !niceToHavesMet.includes(k));
}
