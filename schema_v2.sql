-- Par Value schema v2 — run in Supabase SQL Editor after schema.sql

-- 1. Price history: every listing price is logged, sold prices too
create table if not exists public.price_history (
  id           uuid default gen_random_uuid() primary key,
  listing_id   uuid references public.listings(id) on delete set null,
  brand        text not null,
  model        text not null,
  category     text not null,
  condition    text not null,
  price        numeric(10,2) not null,
  event        text check (event in ('listed', 'sold')) default 'listed',
  recorded_at  timestamp with time zone default now()
);

alter table public.price_history enable row level security;
create policy "Price history readable by everyone"
  on public.price_history for select using (true);
create policy "System can insert price history"
  on public.price_history for insert with check (true);

-- 2. Trigger: auto-log to price_history when a listing goes active or sells
create or replace function public.log_listing_price()
returns trigger as $$
begin
  -- Log when first activated
  if NEW.status = 'active' and (OLD is null or OLD.status <> 'active') then
    insert into public.price_history (listing_id, brand, model, category, condition, price, event)
    values (NEW.id, NEW.brand, NEW.model, NEW.category, NEW.condition, NEW.price, 'listed');
  end if;
  -- Log when sold
  if NEW.status = 'sold' and OLD.status <> 'sold' then
    insert into public.price_history (listing_id, brand, model, category, condition, price, event)
    values (NEW.id, NEW.brand, NEW.model, NEW.category, NEW.condition, NEW.price, 'sold');
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_listing_price_change
  after insert or update on public.listings
  for each row execute procedure public.log_listing_price();

-- 3. Market averages view — avg/min/max per brand + model + condition
create or replace view public.market_averages as
select
  brand,
  model,
  condition,
  round(avg(price)::numeric, 2)  as avg_price,
  min(price)                      as low_price,
  max(price)                      as high_price,
  count(*)                        as sample_count
from public.price_history
group by brand, model, condition;

-- 4. Buyer condition ratings — buyer rates actual condition after receiving club
create table if not exists public.condition_ratings (
  id               uuid default gen_random_uuid() primary key,
  listing_id       uuid references public.listings(id) on delete cascade not null,
  buyer_id         uuid references public.profiles(id) on delete cascade not null,
  actual_condition text check (actual_condition in (
    'new', 'used_like_new', 'used_very_good', 'used_fair'
  )) not null,
  notes            text,
  created_at       timestamp with time zone default now(),
  unique(listing_id, buyer_id)
);

alter table public.condition_ratings enable row level security;
create policy "Condition ratings readable by everyone"
  on public.condition_ratings for select using (true);
create policy "Buyers can submit condition ratings"
  on public.condition_ratings for insert with check (auth.uid() = buyer_id);
