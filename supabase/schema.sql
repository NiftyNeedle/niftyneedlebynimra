-- ============================================================
--  Nifty Needle — database schema (Phase 1: product catalog)
--  Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  category_slug     text not null,
  price             numeric(10,2) not null default 0,
  sale_price        numeric(10,2),
  currency          text not null default 'USD',
  rating            numeric(2,1) not null default 5.0,
  review_count      integer not null default 0,
  swatch            text not null default '',
  colors            text[] not null default '{}',
  materials         text[] not null default '{}',
  short_description text not null default '',
  is_best_seller    boolean not null default false,
  is_new            boolean not null default false,
  customizable      boolean not null default false,
  in_stock          boolean not null default true,
  archived          boolean not null default false,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_flags_idx on public.products (is_best_seller, is_new);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------
alter table public.products enable row level security;

-- Anyone (including the public anon/publishable key) can read non-archived products.
drop policy if exists "public read products" on public.products;
create policy "public read products"
  on public.products for select
  using (archived = false);

-- Writes are NOT granted to anon here. Manage products via the Supabase
-- Table Editor, or (Phase 2) via an authenticated admin + a write policy.
