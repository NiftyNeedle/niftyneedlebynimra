-- ============================================================
--  Nifty Needle — customer product reviews (dynamic ratings)
--  Run once in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null,
  author     text not null,
  rating     integer not null check (rating between 1 and 5),
  body       text not null,
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews (product_id);

-- Anyone can read reviews; inserts happen via a server action (service key).
alter table public.reviews enable row level security;
drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select using (true);

-- Clear the seeded/fake ratings: everything starts at 5.0 with 0 reviews,
-- then updates automatically as real reviews come in.
update public.products set rating = 5.0, review_count = 0;
