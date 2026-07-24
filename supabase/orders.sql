-- ============================================================
--  Nifty Needle — orders (checkout)
--  Run once in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- Human-friendly order numbers: NN-1001, NN-1002, …
create sequence if not exists public.orders_seq start 1001;

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique
                    default ('NN-' || to_char(nextval('public.orders_seq'), 'FM0000')),
  status          text not null default 'Order Received',
  name            text,
  email           text,
  phone           text,
  address         text,
  city            text,
  postal_code     text,
  country         text,
  state           text,
  shipping_method text,
  items           jsonb not null default '[]',
  subtotal        numeric(10,2) not null default 0,
  shipping        numeric(10,2) not null default 0,
  tax             numeric(10,2) not null default 0,
  total           numeric(10,2) not null default 0,
  currency        text not null default 'USD',
  tracking        text,
  created_at      timestamptz not null default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);

-- RLS on, no policies: reachable only via server actions using the
-- service-role key (checkout insert, admin reads, order tracking lookup).
alter table public.orders enable row level security;
