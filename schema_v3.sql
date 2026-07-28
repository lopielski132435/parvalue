-- Par Value schema v3 — run in Supabase SQL Editor after schema_v2.sql

-- Add US state to every profile (buyer or seller) — shown even before identity reveal
alter table public.profiles
  add column if not exists state text check (state in (
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
    'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
    'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
    'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
    'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
    'DC'
  ));

-- Fix handle_new_user(): it never persisted seller_type or state from signup metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, seller_type, state)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'seller_type', 'private'),
    new.raw_user_meta_data->>'state'
  );
  return new;
end;
$$ language plpgsql security definer;
