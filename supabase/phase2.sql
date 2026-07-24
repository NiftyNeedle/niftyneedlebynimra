-- ============================================================
--  Nifty Needle — Phase 2 migration (product photos)
--  Run this once in the Supabase SQL Editor if you already ran
--  the original schema.sql (which didn't have image_url yet).
-- ============================================================

alter table public.products
  add column if not exists image_url text;

-- The "product-images" Storage bucket is created automatically by the
-- app the first time you upload a photo from the admin panel, so no
-- extra steps are needed here.
