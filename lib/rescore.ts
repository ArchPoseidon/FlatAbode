import { getSupabaseAdmin } from './supabase';
import { scoreListing, type ExtractedListingFields } from './scoring';
import type { Preferences } from './types';

// Scores one listing against every onboarded member of its group and upserts listing_scores.
export async function rescoreListing(listingId: string, groupId: string, fields: ExtractedListingFields) {
  const supabase = getSupabaseAdmin();

  const { data: members } = await supabase.from('members').select('id').eq('group_id', groupId);
  const memberIds = (members ?? []).map((m) => m.id);
  if (memberIds.length === 0) return;

  const { data: preferences } = await supabase.from('preferences').select('*').in('member_id', memberIds);
  if (!preferences || preferences.length === 0) return;

  // Pooled budget: everyone in the group splits the rent, so what matters is
  // the sum of every onboarded member's budget, not any one person's number.
  const groupBudgetMax = preferences.reduce((sum, row) => sum + (row.budget_max ?? 0), 0);

  const rows = preferences.map((row) => {
    const prefs = row as Preferences;
    const score = scoreListing(prefs, fields, groupBudgetMax);
    return {
      listing_id: listingId,
      member_id: prefs.member_id,
      must_haves_met: score.must_haves_met,
      unmet_must_haves: score.unmet_must_haves,
      unverified_must_haves: score.unverified_must_haves,
      nice_to_haves_met: score.nice_to_haves_met,
      updated_at: new Date().toISOString(),
    };
  });

  await supabase.from('listing_scores').upsert(rows, { onConflict: 'listing_id,member_id' });
}
