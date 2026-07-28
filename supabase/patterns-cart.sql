-- ============================================================
--  Nifty Needle — patterns in the cart (run once, after patterns.sql)
--
--  Lets patterns be bought through the normal cart/checkout alongside
--  products. Safe to run on an existing database.
-- ============================================================

create extension if not exists "pgcrypto";

-- 1) Mark pattern-only orders so they stay out of the physical Orders view
--    (their sales still show under Admin → Patterns).
alter table public.orders
  add column if not exists digital_only boolean not null default false;

-- 2) pattern_sales: key each sale by the order it belongs to, so an order
--    can contain several patterns (and a buyer is never emailed twice).
create table if not exists public.pattern_sales (
  id            uuid primary key default gen_random_uuid(),
  order_ref     text,
  pattern_id    uuid references public.patterns(id) on delete set null,
  pattern_title text,
  email         text,
  amount        numeric(10,2) not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.pattern_sales add column if not exists order_ref text;
-- Drop the old single-purchase key if an earlier version created it.
alter table public.pattern_sales drop column if exists stripe_session_id;

-- One row per (order, pattern) → idempotent delivery.
create unique index if not exists pattern_sales_order_pattern_idx
  on public.pattern_sales (order_ref, pattern_id);
create index if not exists pattern_sales_created_idx
  on public.pattern_sales (created_at desc);

alter table public.pattern_sales enable row level security;

-- 3) Free-pattern "send once per email" (in case patterns.sql wasn't re-run).
create table if not exists public.pattern_downloads (
  id          uuid primary key default gen_random_uuid(),
  pattern_id  uuid references public.patterns(id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now(),
  unique (pattern_id, email)
);
alter table public.pattern_downloads enable row level security;
/