-- ============================================================
--  Nifty Needle — product categories (admin-managed)
--  Run once in the Supabase SQL Editor.
--
--  Categories power the shop filter, the navbar "Collections" menu, and
--  the home collections grid. Manage them from Admin → Categories.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text not null default '',
  icon        text not null default '🧶',   -- emoji shown on cards
  accent      text not null default 'sage',  -- pink | sage | brown
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists categories_sort_idx on public.categories (sort_order);

-- Anyone can read categories; writes are service-key only.
alter table public.categories enable row level security;
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories
  for select using (true);

-- Seed the starter categories (idempotent). Edit or delete them freely
-- from Admin → Categories.
insert into public.categories (slug, name, description, icon, accent, sort_order) values
  ('crochet-flowers', 'Crochet Flowers', 'Everlasting blooms that never wilt.',   '🌸', 'pink',  1),
  ('bouquets',        'Bouquets',        'Handtied arrangements made to last.',   '💐', 'sage',  2),
  ('plushies',        'Plushies',        'Soft, huggable amigurumi friends.',     '🧸', 'brown', 3),
  ('keychains',       'Keychains',       'Tiny charms with big personality.',     '🔑', 'pink',  4),
  ('home-decor',      'Home Décor',      'Cosy touches for every corner.',        '🏡', 'sage',  5),
  ('baby-gifts',      'Baby Gifts',      'Gentle keepsakes for little ones.',     '🍼', 'brown', 6),
  ('seasonal',        'Seasonal Collection', 'Limited pieces for every occasion.', '🍂', 'pink', 7),
  ('gift-sets',       'Gift Sets',       'Beautifully bundled and ready to give.', '🎁', 'brown', 8),
  ('accessories',     'Accessories',     'Wearable handmade details.',            '👜', 'pink',  9)
on conflict (slug) do nothing;
