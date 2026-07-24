-- ============================================================
--  Nifty Needle — custom order requests
--  Run once in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.custom_orders (
  id                   uuid primary key default gen_random_uuid(),
  status               text not null default 'New',
  title                text,
  product_type         text,
  occasion             text,
  description          text,
  colors               text,
  size                 text,
  budget               text,
  deadline             text,
  quantity             integer,
  gift_wrapping        text,
  pinterest            text,
  instagram            text,
  special_instructions text,
  name                 text,
  email                text,
  phone                text,
  country              text,
  address              text,
  preferred_contact    text,
  reference_images     text[] not null default '{}',
  created_at           timestamptz not null default now()
);

create index if not exists custom_orders_created_idx
  on public.custom_orders (created_at desc);

-- RLS on, no policies: nothing is reachable with the public/anon key.
-- Submissions and admin reads both go through server actions that use the
-- service-role key, which bypasses RLS.
alter table public.custom_orders enable row level security;
