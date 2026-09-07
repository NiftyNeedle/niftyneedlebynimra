-- ============================================================
--  Nifty Needle — orders (checkout)
--  Run once in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

-- Random, unguessable order numbers: NN-7K3QX9P2, NN-M4TB6WZ8, …
-- (A random number doubles as a private token, so orders can't be
--  enumerated on the public tracking page.) Alphabet omits look-alike
--  characters (no 0/O, 1/I/L) for easy reading.
create or replace function public.gen_order_number()
returns text
language plpgsql
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
begin
  loop
    candidate := 'NN-';
    for i in 1..8 loop
      candidate := candidate
        || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (
      select 1 from public.orders where order_number = candidate
    );
  end loop;
  return candidate;
end;
$$;

create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    text not null unique default public.gen_order_number(),
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
  currency        text not null default 'EUR',
  tracking        text,
  created_at      timestamptz not null default now()
);

create index if not exists orders_created_idx on public.orders (created_at desc);

-- RLS on, no policies: reachable only via server actions using the
-- service-role key (checkout insert, admin reads, order tracking lookup).
alter table public.orders enable row level security;
