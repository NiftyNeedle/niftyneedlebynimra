-- ============================================================
--  Nifty Needle — record coupon usage on orders
--  Run once in the Supabase SQL Editor (safe on an existing DB).
--
--  Adds the coupon code and discount amount to each order so a
--  discounted order's subtotal − discount + shipping + tax = total.
--  (Checkout works even before this is run — it just won't record the
--   coupon/discount columns until they exist.)
-- ============================================================

alter table public.orders
  add column if not exists coupon_code text;

alter table public.orders
  add column if not exists discount numeric(10,2) not null default 0;
