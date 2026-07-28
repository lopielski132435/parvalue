-- Par Value database schema

-- Profiles (extends Supabase auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  seller_type text check (seller_type in ('private', 'dealer')) default 'private',
  rating numeric(3,2) default 0,
  sales_count int default 0,
  created_at timestamp with time zone default now()
);

-- Listings
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  brand text not null,
  model text not null,
  year int,
  category text check (category in ('driver','fairway_wood','iron_set','iron','wedge','putter','bag','apparel','other')) not null,
  condition text check (condition in ('new','like_new','excellent','very_good','good','fair')) not null,
  price numeric(10,2) not null,
  loft text,
  flex text check (flex in ('extra_stiff','stiff','regular','senior','ladies')),
  hand text check (hand in ('right','left')) default 'right',
  shaft text,
  grip text,
  description text,
  location text,
  status text check (status in ('active','sold','draft')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Listing images
create table public.listing_images (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  url text not null,
  position int default 0
);

-- Watchlist
create table public.watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, listing_id)
);

-- Messages
create table public.messages (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  read boolean default false,
  created_at timestamp with time zone default now()
);

-- Offers
create table public.offers (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  amount numeric(10,2) not null,
  status text check (status in ('pending','accepted','declined','expired')) default 'pending',
  created_at timestamp with time zone default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.watchlist enable row level security;
alter table public.messages enable row level security;
alter table public.offers enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Listings: active listings are public, owners manage their own
create policy "Active listings viewable by everyone" on public.listings for select using (status = 'active' or auth.uid() = user_id);
create policy "Users can create listings" on public.listings for insert with check (auth.uid() = user_id);
create policy "Users can update their own listings" on public.listings for update using (auth.uid() = user_id);
create policy "Users can delete their own listings" on public.listings for delete using (auth.uid() = user_id);

-- Listing images: public read, owner write
create policy "Listing images viewable by everyone" on public.listing_images for select using (true);
create policy "Listing owners can manage images" on public.listing_images for all using (
  auth.uid() = (select user_id from public.listings where id = listing_id)
);

-- Watchlist: private to each user
create policy "Users can manage their own watchlist" on public.watchlist for all using (auth.uid() = user_id);

-- Messages: only sender and recipient can see
create policy "Users can see their own messages" on public.messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);

-- Offers: buyer and listing owner can see
create policy "Users can see relevant offers" on public.offers for select using (
  auth.uid() = buyer_id or
  auth.uid() = (select user_id from public.listings where id = listing_id)
);
create policy "Buyers can make offers" on public.offers for insert with check (auth.uid() = buyer_id);
create policy "Listing owners can respond to offers" on public.offers for update using (
  auth.uid() = (select user_id from public.listings where id = listing_id)
);
