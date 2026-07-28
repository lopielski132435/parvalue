-- Par Value schema v5 — run in Supabase SQL Editor after schema_v4.sql

-- Sequence starting at 10000 so listing numbers are always 5 digits
create sequence if not exists public.listing_number_seq start 10000;

-- Add listing_number column — auto-assigned on insert, never changes after
alter table public.listings
  add column if not exists listing_number text
  default ('PV-' || nextval('public.listing_number_seq')::text);

-- Grant usage on the sequence to authenticated users so inserts work
grant usage, select on sequence public.listing_number_seq to authenticated;
