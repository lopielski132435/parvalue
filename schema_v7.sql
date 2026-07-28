-- Par Value schema v7 — run in Supabase SQL Editor after schema_v6.sql

-- Store rejection reason on the listing
alter table public.listings
  add column if not exists rejection_reason text;
