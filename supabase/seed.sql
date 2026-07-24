-- Nifty Needle — product seed (generated from src/lib/data.ts)
-- Run AFTER schema.sql, in the Supabase SQL Editor.

insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'blush-rose-bouquet', 'Blush Rose Bouquet', 'bouquets', 68, 54, 'USD', 4.9, 10, 'linear-gradient(135deg,#f3d7d2,#d3a7a1,#c0857e)', ARRAY['Blush', 'Ivory', 'Sage']::text[], ARRAY['Premium cotton yarn', 'Floral wire']::text[], 'A dozen everlasting roses, hand-tied in soft blush.', true, false, true, true, 0
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'honey-bear-plushie', 'Honey the Bear', 'plushies', 42, NULL, 'USD', 5, 17, 'linear-gradient(135deg,#e6dac6,#cbb794,#9c7f5a)', ARRAY['Honey', 'Caramel', 'Cream']::text[], ARRAY['Organic cotton', 'Hypoallergenic filling']::text[], 'A cuddly amigurumi bear with an embroidered smile.', true, true, true, true, 1
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'sage-tulip-trio', 'Sage Tulip Trio', 'crochet-flowers', 24, NULL, 'USD', 4.8, 6, 'linear-gradient(135deg,#d6e0cb,#8fa57e,#6e8560)', ARRAY['Sage', 'Sand', 'Blush']::text[], ARRAY['Cotton yarn', 'Bendable stems']::text[], 'Three delicate tulips that bloom forever.', true, false, true, true, 2
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'cloud-baby-mobile', 'Cloud Baby Mobile', 'baby-gifts', 58, NULL, 'USD', 4.9, 4, 'linear-gradient(135deg,#faf8f4,#e6dac6,#d3a7a1)', ARRAY['Cloud', 'Blush', 'Sky']::text[], ARRAY['Soft cotton', 'Birch hoop']::text[], 'A dreamy nursery mobile of clouds and stars.', true, true, true, true, 3
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'mini-strawberry-keychain', 'Mini Strawberry Keychain', 'keychains', 12, NULL, 'USD', 4.7, 25, 'linear-gradient(135deg,#f3d7d2,#c0857e,#8fa57e)', ARRAY['Berry', 'Sage']::text[], ARRAY['Cotton yarn', 'Gold clasp']::text[], 'A pocket-sized berry charm for keys or bags.', true, false, false, true, 4
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'dusty-pink-tote', 'Dusty Pink Market Tote', 'accessories', 46, NULL, 'USD', 4.8, 7, 'linear-gradient(135deg,#e9c9c4,#d3a7a1,#c0857e)', ARRAY['Dusty Pink', 'Cream']::text[], ARRAY['Recycled cotton cord']::text[], 'A roomy, hand-stitched tote for slow mornings.', true, false, true, true, 5
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'autumn-pumpkin-set', 'Autumn Pumpkin Set', 'seasonal', 34, NULL, 'USD', 4.9, 5, 'linear-gradient(135deg,#e6dac6,#cbb794,#c0857e)', ARRAY['Rust', 'Sand', 'Sage']::text[], ARRAY['Cotton yarn', 'Cinnamon stem']::text[], 'A trio of cosy pumpkins for the mantel.', true, true, true, true, 6
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'lavender-coaster-set', 'Lavender Coaster Set', 'home-decor', 28, NULL, 'USD', 4.7, 3, 'linear-gradient(135deg,#f3ece0,#d6c3a5,#8fa57e)', ARRAY['Lavender', 'Cream', 'Sage']::text[], ARRAY['Cotton yarn']::text[], 'Four scalloped coasters to dress any table.', true, false, false, true, 7
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'peony-garden-bouquet', 'Peony Garden Bouquet', 'bouquets', 82, NULL, 'USD', 4.9, 3, 'linear-gradient(135deg,#f3d7d2,#e9c9c4,#8fa57e)', ARRAY['Blush', 'Ivory', 'Sage']::text[], ARRAY['Premium cotton yarn', 'Floral wire']::text[], 'Lush peonies and greenery, hand-tied to order.', false, true, true, true, 8
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'bunny-amigurumi', 'Willow the Bunny', 'plushies', 38, NULL, 'USD', 4.9, 13, 'linear-gradient(135deg,#faf8f4,#e6dac6,#d3a7a1)', ARRAY['Cream', 'Blush']::text[], ARRAY['Organic cotton', 'Hypoallergenic filling']::text[], 'A floppy-eared bunny with a hand-stitched face.', false, false, true, true, 9
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'daisy-hair-clips', 'Daisy Hair Clip Set', 'accessories', 16, NULL, 'USD', 4.6, 7, 'linear-gradient(135deg,#faf8f4,#f3ece0,#cbb794)', ARRAY['Ivory', 'Butter']::text[], ARRAY['Cotton yarn', 'Metal clips']::text[], 'A pair of cheerful daisies for everyday wear.', false, false, false, true, 10
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'cozy-plant-pot-cover', 'Cozy Plant Pot Cover', 'home-decor', 22, NULL, 'USD', 4.7, 3, 'linear-gradient(135deg,#d6e0cb,#8fa57e,#6e8560)', ARRAY['Sage', 'Sand']::text[], ARRAY['Cotton yarn']::text[], 'Dress up any planter with a soft knit cover.', false, false, true, true, 11
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'newborn-booties', 'Newborn Booties', 'baby-gifts', 18, NULL, 'USD', 5, 10, 'linear-gradient(135deg,#faf8f4,#f3d7d2,#d3a7a1)', ARRAY['Blush', 'Cloud', 'Butter']::text[], ARRAY['Soft baby cotton']::text[], 'The softest first booties, made to be treasured.', false, true, true, true, 12
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'sunflower-single-stem', 'Sunflower Single Stem', 'crochet-flowers', 14, NULL, 'USD', 4.8, 5, 'linear-gradient(135deg,#f0e2b8,#cbb794,#8fa57e)', ARRAY['Golden', 'Sage']::text[], ARRAY['Cotton yarn', 'Bendable stem']::text[], 'One sunny bloom to brighten any vase.', false, false, false, false, 13
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'holiday-ornament-set', 'Holiday Ornament Set', 'seasonal', 30, NULL, 'USD', 4.9, 4, 'linear-gradient(135deg,#f3d7d2,#c0857e,#6e8560)', ARRAY['Berry', 'Sage', 'Cream']::text[], ARRAY['Cotton yarn']::text[], 'A set of five heirloom ornaments for the tree.', false, false, true, true, 14
) on conflict (slug) do nothing;
insert into public.products (slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (
  'self-care-gift-set', 'Self-Care Gift Set', 'gift-sets', 64, NULL, 'USD', 4.9, 3, 'linear-gradient(135deg,#e9c9c4,#d3a7a1,#8fa57e)', ARRAY['Blush', 'Sage']::text[], ARRAY['Cotton yarn', 'Gift box']::text[], 'Coasters, a flower, and a keychain, beautifully boxed.', false, true, true, true, 15
) on conflict (slug) do nothing;
