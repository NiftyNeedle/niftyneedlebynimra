-- ============================================================
--  Nifty Needle — review moderation
--  Run once in the Supabase SQL Editor.
-- ============================================================

alter table public.reviews
  add column if not exists approved boolean not null default false;

-- Keep any reviews collected before moderation existed visible.
update public.reviews set approved = true;

-- Public can now only read APPROVED reviews. Admin reads/writes via the
-- service key (bypasses RLS) for moderation.
drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews
  for select using (approved = true);
