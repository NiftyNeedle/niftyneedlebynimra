-- ============================================================
--  Nifty Needle — self-serve coupons
--  Run once in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.coupons (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  rate        numeric(4,2) not null,     -- fraction, e.g. 0.10 = 10% off
  description text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.coupons enable row level security;

-- Anyone can read ACTIVE coupons (so the cart can validate codes).
drop policy if exists "coupons public read" on public.coupons;
create policy "coupons public read" on public.coupons
  for select using (active = true);

-- Seed the two existing codes (idempotent).
insert into public.coupons (code, rate, description) values
  ('WELCOME10', 0.10, '10% off — welcome discount'),
  ('LOVE15',    0.15, '15% off your order')
on conflict (code) do nothing;
