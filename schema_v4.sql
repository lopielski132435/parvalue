-- Par Value schema v4 — run in Supabase SQL Editor after schema_v3.sql

-- Add verification code column to listings
alter table public.listings
  add column if not exists verification_code text;

-- Add 'under_review' to the status check constraint
-- Drop existing constraint first, then re-add with new value
alter table public.listings
  drop constraint if exists listings_status_check;

alter table public.listings
  add constraint listings_status_check
  check (status in ('draft', 'under_review', 'active', 'sold', 'archived'));
