-- ============================================================
--  Nifty Needle — newsletter subscribers
--  Run once in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

-- RLS on, no policies: only the server action (service key) can read/write.
alter table public.newsletter_subscribers enable row level security;
