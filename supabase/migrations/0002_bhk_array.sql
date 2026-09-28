-- Preferences.bhk becomes a multi-select (text[]) instead of a single value.
-- Existing single values are preserved as one-element arrays; nulls become "no preference".
alter table preferences
  alter column bhk type text[]
  using case when bhk is null or bhk = '' then '{}'::text[] else array[bhk] end;

alter table preferences alter column bhk set default '{}';
alter table preferences alter column bhk set not null;
