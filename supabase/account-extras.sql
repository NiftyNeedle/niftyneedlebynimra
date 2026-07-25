-- ============================================================
--  Nifty Needle — saved addresses + link custom orders to accounts
--  Run once in the Supabase SQL Editor.
-- ============================================================

-- Link custom order requests to the logged-in customer (guests stay null).
alter table public.custom_orders
  add column if not exists user_id uuid;

create index if not exists custom_orders_user_idx
  on public.custom_orders (user_id);

-- Saved shipping addresses, one row per address.
create table if not exists public.addresses (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  label       text,
  name        text,
  line        text,
  city        text,
  postal_code text,
  country     text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists addresses_user_idx on public.addresses (user_id);

alter table public.addresses enable row level security;

drop policy if exists "own addresses select" on public.addresses;
create policy "own addresses select" on public.addresses
  for select using (auth.uid() = user_id);

drop policy if exists "own addresses insert" on public.addresses;
create policy "own addresses insert" on public.addresses
  for insert with check (auth.uid() = user_id);

drop policy if exists "own addresses update" on public.addresses;
create policy "own addresses update" on public.addresses
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own addresses delete" on public.addresses;
create policy "own addresses delete" on public.addresses
  for delete using (auth.uid() = user_id);
