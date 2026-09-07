-- ============================================================
--  Nifty Needle — product gallery migration (up to 5 photos)
--  Run this once in the Supabase SQL Editor if you already ran
--  schema.sql before `image_urls` existed.
-- ============================================================

alter table public.products
  add column if not exists image_urls text[] not null default '{}';

-- Backfill the gallery from the old single photo so existing
-- products keep their image.
update public.products
   set image_urls = array[image_url]
 where image_url is not null
   and image_url <> ''
   and coalesce(array_length(image_urls, 1), 0) = 0;

-- `image_url` is kept in sync with image_urls[1] by the admin panel and
-- still powers cards, cart thumbnails and emails.
