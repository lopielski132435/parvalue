-- Par Value schema v9 — Pierogi Open live scoring (one-day event, run in Supabase SQL Editor after schema_v8.sql)

create table if not exists public.pierogi_scores (
  id           uuid primary key default gen_random_uuid(),
  player_name  text not null,
  hole_number  smallint not null check (hole_number between 1 and 18),
  strokes      smallint not null check (strokes between 1 and 20),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (player_name, hole_number)
);

alter table public.pierogi_scores enable row level security;

create policy "Anyone can view pierogi scores"
  on public.pierogi_scores
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can post a pierogi score"
  on public.pierogi_scores
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can correct a pierogi hole score"
  on public.pierogi_scores
  for update
  to anon, authenticated
  using (true)
  with check (true);

create index if not exists pierogi_scores_player on public.pierogi_scores (player_name);
