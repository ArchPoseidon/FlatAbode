import type { Database } from './database.types';

export type Listing = Database['public']['Tables']['listings']['Row'];
export type ListingScoreRow = Database['public']['Tables']['listing_scores']['Row'];
export type ListingReactionRow = Database['public']['Tables']['listing_reactions']['Row'];
export type ListingNoteRow = Database['public']['Tables']['listing_notes']['Row'];
export type Member = Database['public']['Tables']['members']['Row'];

export interface DashboardPayload {
  listings: Listing[];
  scores: ListingScoreRow[];
  reactions: ListingReactionRow[];
  notes: ListingNoteRow[];
  members: Member[];
}
