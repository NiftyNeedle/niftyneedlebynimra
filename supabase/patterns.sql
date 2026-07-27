-- ============================================================
--  Nifty Needle — crochet patterns (digital products)
--  Run once in the Supabase SQL Editor.
--
--  Patterns are digital: no shipping, no order confirmation. The PDF
--  is emailed to the buyer (paid) or to anyone who requests a free one.
--  PDFs live in a PRIVATE storage bucket ("pattern-files") so they can
--  never be downloaded straight off the site — only delivered by email.
--  (Both storage buckets are created automatically on first upload.)
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.patterns (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  description   text not null default '',
  finished_size text not null default '',   -- "makes a 30cm tall bear", etc.
  difficulty    text not null default '',   -- Beginner / Intermediate / Advanced
  price         numeric(10,2) not null default 0,
  is_free       boolean not null default false,
  image_url     text,                       -- public cover image
  pdf_path      text,                       -- path inside the PRIVATE bucket
  published     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists patterns_created_idx on public.patterns (created_at desc);

-- Anyone may read published patterns' details; the pdf_path is only a
-- storage path (useless without the service key / a signed URL), and the
-- public data layer never selects it anyway. Writes are service-key only.
alter table public.patterns enable row level security;
drop policy if exists "patterns public read" on public.patterns;
create policy "patterns public read" on public.patterns
  for select using (published = true);

-- One row per pattern sold. Doubles as (a) your sales record and (b) an
-- idempotency guard (unique per order+pattern) so a buyer is never emailed
-- twice. order_ref is the order the pattern was bought in.
create table if not exists public.pattern_sales (
  id            uuid primary key default gen_random_uuid(),
  order_ref     text,
  pattern_id    uuid references public.patterns(id) on delete set null,
  pattern_title text,
  email         text,
  amount        numeric(10,2) not null default 0,
  created_at    timestamptz not null default now()
);

create unique index if not exists pattern_sales_order_pattern_idx
  on public.pattern_sales (order_ref, pattern_id);
create index if not exists pattern_sales_created_idx
  on public.pattern_sales (created_at desc);

-- RLS on, no policies: only server actions (service key) touch this.
alter table public.pattern_sales enable row level security;

-- Tracks who has already been emailed each FREE pattern, so the same
-- pattern is only ever sent once per email address.
create table if not exists public.pattern_downloads (
  id          uuid primary key default gen_random_uuid(),
  pattern_id  uuid references public.patterns(id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now(),
  unique (pattern_id, email)
);

alter table public.pattern_downloads enable row level security;
