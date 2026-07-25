-- ============================================================
--  Nifty Needle — customer accounts (orders + wishlist per user)
--  Run once in the Supabase SQL Editor.
--  Also enable Email auth in Supabase → Authentication → Providers.
-- ============================================================

-- Link orders to the logged-in customer (guest orders leave this null).
alter table public.orders
  add column if not exists user_id uuid;

create index if not exists orders_user_idx on public.orders (user_id);

-- Per-account wishlist.
create table if not exists public.wishlists (
  user_id    uuid not null,
  product_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.wishlists enable row level security;

-- Each customer can only see and change their own wishlist rows.
drop policy if exists "own wishlist select" on public.wishlists;
create policy "own wishlist select" on public.wishlists
  for select using (auth.uid() = user_id);

drop policy if exists "own wishlist insert" on public.wishlists;
create policy "own wishlist insert" on public.wishlists
  for insert with check (auth.uid() = user_id);

drop policy if exists "own wishlist delete" on public.wishlists;
create policy "own wishlist delete" on public.wishlists
  for delete using (auth.uid() = user_id);
