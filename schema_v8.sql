-- Par Value schema v8 — run in Supabase SQL Editor after schema_v7.sql

-- Watchlist: users save listings they want to track
create table if not exists public.watchlist (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  listing_id  uuid not null references public.listings(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, listing_id)
);

alter table public.watchlist enable row level security;

create policy "Users manage own watchlist"
  on public.watchlist
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Listing views: one row per page view (anonymous or authenticated)
create table if not exists public.listing_views (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  viewer_id   uuid references auth.users(id) on delete set null,
  viewed_at   timestamptz not null default now()
);

alter table public.listing_views enable row level security;

-- Anyone can insert a view (anon + authenticated)
create policy "Anyone can log a view"
  on public.listing_views
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated users can read views (for owner stats)
create policy "Authenticated users can read views"
  on public.listing_views
  for select
  to authenticated
  using (true);

-- Index for fast view counts in the last 24h
create index if not exists listing_views_listing_viewed
  on public.listing_views (listing_id, viewed_at desc);
