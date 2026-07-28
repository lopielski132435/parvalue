-- Par Value schema v6 — run in Supabase SQL Editor after schema_v5.sql

-- Add is_admin flag to profiles
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- RLS policy: admins can update any listing's status
create policy "Admins can update any listing"
  on public.listings
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Set yourself as admin — replace with your actual user UUID from Supabase Auth
-- update public.profiles set is_admin = true where id = 'YOUR-USER-UUID-HERE';
