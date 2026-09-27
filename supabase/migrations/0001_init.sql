-- FlatAbode schema
-- Everything is written/read through the server (service role key) only.
-- No client-side Supabase access, so RLS stays on with no permissive policies.

create extension if not exists "pgcrypto";

create table groups (
  id uuid primary key default gen_random_uuid(),
  city text not null default 'Bangalore',
  created_at timestamptz not null default now()
);

create table members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  name text not null,
  slug text unique not null,
  is_creator boolean not null default false,
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

create index members_group_id_idx on members(group_id);

create table preferences (
  member_id uuid primary key references members(id) on delete cascade,
  budget_max int,
  bhk text,
  locations text[] not null default '{}',
  floor_pref text,
  must_have_amenities text[] not null default '{}',
  custom_must_haves text[] not null default '{}',
  nice_to_haves text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups(id) on delete cascade,
  added_by uuid not null references members(id),
  source_type text not null check (source_type in ('url', 'manual')),
  source_url text,
  title text,
  description text,
  rent int,
  bhk text,
  locality text,
  photos text[] not null default '{}',
  cover_photo text,
  extracted_fields jsonb not null default '{}'::jsonb,
  extraction_confidence jsonb not null default '{}'::jsonb,
  status text not null default 'extracting' check (status in ('extracting', 'ready', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

create index listings_group_id_idx on listings(group_id);

create table listing_notes (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  member_id uuid not null references members(id),
  body text not null,
  created_at timestamptz not null default now()
);

create index listing_notes_listing_id_idx on listing_notes(listing_id);

create table listing_scores (
  listing_id uuid not null references listings(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  must_haves_met boolean not null,
  unmet_must_haves text[] not null default '{}',
  unverified_must_haves text[] not null default '{}',
  nice_to_haves_met text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (listing_id, member_id)
);

create table listing_reactions (
  listing_id uuid not null references listings(id) on delete cascade,
  member_id uuid not null references members(id) on delete cascade,
  loved boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (listing_id, member_id)
);

alter table groups enable row level security;
alter table members enable row level security;
alter table preferences enable row level security;
alter table listings enable row level security;
alter table listing_notes enable row level security;
alter table listing_scores enable row level security;
alter table listing_reactions enable row level security;

-- No policies are created: anon/authenticated roles get zero access.
-- All reads/writes happen server-side with the service role key, which bypasses RLS.
