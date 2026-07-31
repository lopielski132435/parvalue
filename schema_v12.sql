-- Par Value schema v12 — make Pierogi Open's golfer roster shared/event-wide instead of per-device

create table if not exists public.pierogi_golfers (
  id          uuid primary key default gen_random_uuid(),
  full_name   text not null,
  created_at  timestamptz not null default now()
);

create unique index if not exists pierogi_golfers_name_lower_idx on public.pierogi_golfers (lower(full_name));

alter table public.pierogi_golfers enable row level security;

create policy "Anyone can view pierogi golfers"
  on public.pierogi_golfers
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can add a pierogi golfer"
  on public.pierogi_golfers
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can remove a pierogi golfer"
  on public.pierogi_golfers
  for delete
  to anon, authenticated
  using (true);

alter publication supabase_realtime add table public.pierogi_golfers;
