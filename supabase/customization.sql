-- ============================================================
--  Nifty Needle — per-product customization options
--  Run once in the Supabase SQL Editor.
-- ============================================================

alter table public.products
  add column if not exists customization jsonb;

-- NULL means "customizable with all options" (back-compatible with
-- existing rows). The admin panel writes an explicit object like:
--   {"color":true,"yarn":false,"size":true,"name":true,
--    "giftMessage":true,"instructions":false,"referenceImage":true}
