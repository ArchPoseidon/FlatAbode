export interface Database {
  public: {
    Tables: {
      groups: {
        Row: { id: string; city: string; created_at: string };
        Insert: { id?: string; city?: string; created_at?: string };
        Update: { id?: string; city?: string; created_at?: string };
        Relationships: [];
      };
      members: {
        Row: {
          id: string;
          group_id: string;
          name: string;
          slug: string;
          is_creator: boolean;
          onboarded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          name: string;
          slug: string;
          is_creator?: boolean;
          onboarded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          name?: string;
          slug?: string;
          is_creator?: boolean;
          onboarded_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      preferences: {
        Row: {
          member_id: string;
          budget_max: number | null;
          bhk: string[];
          locations: string[];
          floor_pref: string | null;
          must_have_amenities: string[];
          custom_must_haves: string[];
          nice_to_haves: string[];
          updated_at: string;
        };
        Insert: {
          member_id: string;
          budget_max?: number | null;
          bhk?: string[];
          locations?: string[];
          floor_pref?: string | null;
          must_have_amenities?: string[];
          custom_must_haves?: string[];
          nice_to_haves?: string[];
          updated_at?: string;
        };
        Update: {
          member_id?: string;
          budget_max?: number | null;
          bhk?: string[];
          locations?: string[];
          floor_pref?: string | null;
          must_have_amenities?: string[];
          custom_must_haves?: string[];
          nice_to_haves?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          group_id: string;
          added_by: string;
          source_type: 'url' | 'manual';
          source_url: string | null;
          title: string | null;
          nickname: string | null;
          description: string | null;
          rent: number | null;
          bhk: string | null;
          locality: string | null;
          photos: string[];
          cover_photo: string | null;
          extracted_fields: Record<string, unknown>;
          extraction_confidence: Record<string, unknown>;
          status: 'extracting' | 'ready' | 'failed';
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          added_by: string;
          source_type: 'url' | 'manual';
          source_url?: string | null;
          title?: string | null;
          nickname?: string | null;
          description?: string | null;
          rent?: number | null;
          bhk?: string | null;
          locality?: string | null;
          photos?: string[];
          cover_photo?: string | null;
          extracted_fields?: Record<string, unknown>;
          extraction_confidence?: Record<string, unknown>;
          status?: 'extracting' | 'ready' | 'failed';
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          added_by?: string;
          source_type?: 'url' | 'manual';
          source_url?: string | null;
          title?: string | null;
          nickname?: string | null;
          description?: string | null;
          rent?: number | null;
          bhk?: string | null;
          locality?: string | null;
          photos?: string[];
          cover_photo?: string | null;
          extracted_fields?: Record<string, unknown>;
          extraction_confidence?: Record<string, unknown>;
          status?: 'extracting' | 'ready' | 'failed';
          error_message?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      listing_notes: {
        Row: { id: string; listing_id: string; member_id: string; body: string; created_at: string };
        Insert: { id?: string; listing_id: string; member_id: string; body: string; created_at?: string };
        Update: { id?: string; listing_id?: string; member_id?: string; body?: string; created_at?: string };
        Relationships: [];
      };
      listing_scores: {
        Row: {
          listing_id: string;
          member_id: string;
          must_haves_met: boolean;
          unmet_must_haves: string[];
          unverified_must_haves: string[];
          nice_to_haves_met: string[];
          updated_at: string;
        };
        Insert: {
          listing_id: string;
          member_id: string;
          must_haves_met: boolean;
          unmet_must_haves?: string[];
          unverified_must_haves?: string[];
          nice_to_haves_met?: string[];
          updated_at?: string;
        };
        Update: {
          listing_id?: string;
          member_id?: string;
          must_haves_met?: boolean;
          unmet_must_haves?: string[];
          unverified_must_haves?: string[];
          nice_to_haves_met?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      listing_reactions: {
        Row: { listing_id: string; member_id: string; loved: boolean; updated_at: string };
        Insert: { listing_id: string; member_id: string; loved?: boolean; updated_at?: string };
        Update: { listing_id?: string; member_id?: string; loved?: boolean; updated_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
