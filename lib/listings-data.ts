import { getSupabaseAdmin } from './supabase';
import type { Database } from './database.types';

type Listing = Database['public']['Tables']['listings']['Row'];
type ListingScoreRow = Database['public']['Tables']['listing_scores']['Row'];
type ListingReactionRow = Database['public']['Tables']['listing_reactions']['Row'];
type ListingNoteRow = Database['public']['Tables']['listing_notes']['Row'];
type Member = Database['public']['Tables']['members']['Row'];

export interface DashboardData {
  listings: Listing[];
  scores: ListingScoreRow[];
  reactions: ListingReactionRow[];
  notes: ListingNoteRow[];
  members: Member[];
}

export async function getDashboardData(groupId: string): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();

  const [{ data: listings }, { data: members }] = await Promise.all([
    supabase.from('listings').select('*').eq('group_id', groupId).order('created_at', { ascending: false }),
    supabase.from('members').select('*').eq('group_id', groupId),
  ]);

  const listingIds = (listings ?? []).map((l) => l.id);
  const emptyFilter = listingIds.length ? listingIds : ['00000000-0000-0000-0000-000000000000'];

  const [{ data: scores }, { data: reactions }, { data: notes }] = await Promise.all([
    supabase.from('listing_scores').select('*').in('listing_id', emptyFilter),
    supabase.from('listing_reactions').select('*').in('listing_id', emptyFilter),
    supabase.from('listing_notes').select('*').in('listing_id', emptyFilter).order('created_at', { ascending: true }),
  ]);

  return {
    listings: listings ?? [],
    scores: scores ?? [],
    reactions: reactions ?? [],
    notes: notes ?? [],
    members: members ?? [],
  };
}

export function isGroupQualified(listingId: string, scores: ListingScoreRow[], totalOnboarded: number): boolean {
  const rows = scores.filter((s) => s.listing_id === listingId);
  if (rows.length === 0 || totalOnboarded === 0) return false;
  return rows.length >= totalOnboarded && rows.every((r) => r.must_haves_met);
}
