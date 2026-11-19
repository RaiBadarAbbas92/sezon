-- Sezon demo data — run AFTER supabase/schema.sql. Safe to re-run (skips existing article numbers).

-- Categories — exactly the tree in lib/brand.ts. Sub-categories carry parent_slug; the product form's category
-- dropdown should list only these active rows.
insert into public.catalog_categories (slug, name, parent_slug, icon, image_url, sort_order, is_active) values
  ('clothing', 'Clothing', null, 'shirt', 'https://images.unsplash.com/photo-1752133945372-68600078efe2?auto=format&fit=crop&w=900&q=75', 10, true),
  ('cardigans', 'Cardigans', 'clothing', null, null, 11, true),
  ('pullovers-sweaters', 'Pullovers & Sweaters', 'clothing', null, null, 12, true),
  ('hoodies', 'Hoodies', 'clothing', null, null, 13, true),
  ('sweater-vests', 'Sweater Vests', 'clothing', null, null, 14, true),
  ('shrugs-boleros', 'Shrugs & Boleros', 'clothing', null, null, 15, true),
  ('accessories', 'Accessories', null, 'sparkles', 'https://images.unsplash.com/photo-1606772016409-d4a55e32be6e?auto=format&fit=crop&w=900&q=75', 20, true),
  ('hair-accessories', 'Hair Accessories', 'accessories', null, null, 21, true),
  ('keychains', 'Keychains', 'accessories', null, null, 22, true),
  ('bookmarks', 'Bookmarks', 'accessories', null, null, 23, true),
  ('bags', 'Bags', null, 'bag', 'https://images.unsplash.com/photo-1787432131008-c754654978a4?auto=format&fit=crop&w=900&q=75', 30, true),
  ('home-living', 'Home & Living', null, 'flower', 'https://images.unsplash.com/photo-1753366556699-4be495e5bdd6?auto=format&fit=crop&w=900&q=75', 40, true),
  ('cushion-covers', 'Cushion Covers', 'home-living', null, null, 41, true),
  ('tissue-box-covers', 'Tissue Box Covers', 'home-living', null, null, 42, true),
  ('home-decor', 'Home Décor', 'home-living', null, null, 43, true),
  ('gifts', 'Gifts', null, 'gift', 'https://images.unsplash.com/photo-1707944145479-12755f0434d8?auto=format&fit=crop&w=900&q=75', 50, true),
  ('gift-sets', 'Gift Sets', 'gifts', null, null, 51, true),
  ('custom-gifts', 'Custom Gifts', 'gifts', null, null, 52, true),
  ('amigurumi', 'Amigurumi', null, 'rabbit', 'https://images.unsplash.com/photo-1755315897817-97bd6ec34256?auto=format&fit=crop&w=900&q=75', 60, true)
on conflict (slug) do update set name = excluded.name, parent_slug = excluded.parent_slug, icon = excluded.icon,
  image_url = excluded.image_url, sort_order = excluded.sort_order, is_active = true;

-- Retire every old category (Women's Kurtis, Men's Kurta, Dupattas, Crochet Wear, Baby & Kids, …).
-- Deactivated rather than deleted, so nothing that still references them breaks.
update public.catalog_categories set is_active = false
where slug not in ('clothing','cardigans','pullovers-sweaters','hoodies','sweater-vests','shrugs-boleros',
                   'accessories','hair-accessories','keychains','bookmarks','bags',
                   'home-living','cushion-covers','tissue-box-covers','home-decor',
                   'gifts','gift-sets','custom-gifts','amigurumi');

-- Move existing products off retired slugs that have an obvious new home ('accessories', 'bags', 'gifts',
-- 'amigurumi', 'home-decor' are still valid). Kurtis / kurtas / dupattas have none — re-categorise or archive
-- those from the admin panel.
update public.products set category = 'amigurumi' where category = 'baby';
update public.products set category = 'clothing' where category = 'crochet-wear';

-- Products (demo — edit or delete from the admin panel)
with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Bunny Snuggle Buddy', 'A floppy-eared bunny with a tiny stitched smile, made to be squeezed. Soft enough for naps, sturdy enough for adventures.', 2450, 2900, 'SZ-0001', 'amigurumi',
          '["Mini 15cm","Classic 25cm"]', '["Blush|#F2D3CB","Oat|#ECE1D0","Sage|#A9B79A"]', '["https://images.unsplash.com/photo-1753370241607-5d48d8aaa70e?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1753370241583-82d8c84f0c6e?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1753370241739-1d53df4fe604?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1753370230699-8e21227afeb6?auto=format&fit=crop&w=900&q=75"]', true, true,
          '{"metadata":{"slug":"bunny-snuggle-buddy","status":"Active","rating":4.9,"reviews":128,"materials":"100% milk cotton yarn, hypoallergenic polyfill, safety eyes locked from inside.","care":"Hand wash in cool water with mild soap. Reshape and dry flat in the shade."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0001' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Sunflower Market Tote', 'An airy mesh tote for fruit runs and beach days. Stretches to fit more than you''d think, folds into almost nothing.', 3800, null, 'SZ-0002', 'bags',
          '[]', '["Butter|#EBD9A8","Oat|#ECE1D0"]', '["https://images.unsplash.com/photo-1565592284032-d3c08f2a53e9?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1787432131008-c754654978a4?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1686285961015-12886f9b3bf5?auto=format&fit=crop&w=900&q=75"]', true, true,
          '{"metadata":{"slug":"sunflower-market-tote","status":"Active","rating":4.8,"reviews":64,"materials":"Mercerised cotton, reinforced double-stitched handles.","care":"Hand wash, dry flat. Do not tumble dry."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0002' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Forever Tulip Bouquet', 'Tulips that never wilt. Wrapped in kraft paper with a little handwritten tag — the gift that stays on the shelf for years.', 3200, 3600, 'SZ-0003', 'home-decor',
          '["5 stems","9 stems"]', '["Pink mix|#F2D3CB","Cream mix|#F5EEE3"]', '["https://images.unsplash.com/photo-1768029120664-119e99b02e5b?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1789406075648-fd2688a93865?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1753366556699-4be495e5bdd6?auto=format&fit=crop&w=900&q=75"]', true, true,
          '{"metadata":{"slug":"tulip-bouquet","status":"Active","rating":5,"reviews":92,"materials":"Cotton-acrylic blend, floral wire stems, kraft wrap.","care":"Dust gently with a soft brush. Keep away from direct sun to protect the colour."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0003' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Cloud Scrunchie Set', 'A set of three chunky scrunchies that hold without pulling. Kind to curls, kind to hair.', 950, null, 'SZ-0004', 'hair-accessories',
          '[]', '["Pastels|#F8E6E1","Earthy|#C9A27A"]', '["https://images.unsplash.com/photo-1606772016409-d4a55e32be6e?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1671272980311-9055ae800653?auto=format&fit=crop&w=900&q=75"]', true, true,
          '{"metadata":{"slug":"cloud-scrunchie-set","status":"Active","rating":4.7,"reviews":210,"materials":"Soft cotton yarn over snag-free elastic.","care":"Hand wash, air dry."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0004' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Little Lamb Rattle', 'A gentle rattle with a wooden ring for tiny hands. Lightweight, soft, and safe for little mouths.', 1650, null, 'SZ-0005', 'amigurumi',
          '[]', '["Cream|#F5EEE3"]', '["https://images.unsplash.com/photo-1602773974733-b56200c8653f?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1784368611073-1f2c83e7c7a0?auto=format&fit=crop&w=900&q=75"]', true, false,
          '{"metadata":{"slug":"little-lamb-rattle","status":"Active","rating":4.9,"reviews":41,"materials":"Organic cotton, untreated beech wood ring, enclosed rattle insert.","care":"Spot clean only. Wipe the wooden ring with a damp cloth."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0005' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Mushroom Coaster Set', 'Four little toadstools to keep your chai rings off the table. They look cute stacked, too.', 1400, 1700, 'SZ-0006', 'home-decor',
          '[]', '[]', '["https://images.unsplash.com/photo-1648217736318-fbc4abc138ec?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1761206887052-9abec0c38f03?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1682954013913-25fe41e180c0?auto=format&fit=crop&w=900&q=75"]', true, false,
          '{"metadata":{"slug":"mushroom-coasters","status":"Active","rating":4.6,"reviews":37,"materials":"Thick cotton cord, heat-safe.","care":"Machine wash cold in a laundry bag, dry flat."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0006' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Bear in a Sweater', 'A round little bear in a removable striped sweater. Ask us to stitch a name on the back.', 2750, null, 'SZ-0007', 'amigurumi',
          '[]', '["Honey|#C9A27A","Oat|#ECE1D0"]', '["https://images.unsplash.com/photo-1674069698102-682409828872?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1715259118737-670c63950059?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1715432755528-46ddd67eab7c?auto=format&fit=crop&w=900&q=75"]', true, false,
          '{"metadata":{"slug":"bear-in-a-sweater","status":"Active","rating":4.8,"reviews":55,"materials":"Milk cotton yarn, polyfill, embroidered eyes (baby safe).","care":"Hand wash in cool water, dry flat."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0007' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Tiny Joy Gift Box', 'A mini amigurumi, a scrunchie set and a bookmark, tucked into a ribboned box with your note.', 4200, null, 'SZ-0008', 'gift-sets',
          '[]', '[]', '["https://images.unsplash.com/photo-1751450236048-aa1981f7bc2d?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1707944145479-12755f0434d8?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1625552186152-668cd2f0b707?auto=format&fit=crop&w=900&q=75"]', true, false,
          '{"metadata":{"slug":"tiny-gift-box","status":"Active","rating":5,"reviews":29,"materials":"Assorted cotton crochet pieces, recycled kraft box.","care":"See each item''s card inside the box."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0008' from p;

with p as (
  insert into public.products (name, description, price, compare_at_price, article_number, category, size, color, img, instock, bestsellere, cost_breakdown)
  values ('Daisy Crochet Cardigan', 'Granny-square cardigan, hooked by hand square by square. Takes about a week to make each one — worth every loop.', 6800, null, 'SZ-0016', 'cardigans',
          '["S","M","L"]', '["Cream & brown|#C9A27A","Sage|#A9B79A"]', '["https://images.unsplash.com/photo-1679847628912-4c3e7402abc7?auto=format&fit=crop&w=900&q=75","https://images.unsplash.com/photo-1752133945372-68600078efe2?auto=format&fit=crop&w=900&q=75"]', true, true,
          '{"metadata":{"slug":"daisy-crochet-cardigan","status":"Active","rating":5,"reviews":19,"materials":"Soft cotton-acrylic yarn, wooden buttons.","care":"Hand wash cold, dry flat. Never hang — it stretches."}}'::jsonb)
  on conflict (article_number) do nothing
  returning id
)
insert into public.inventory (product_id, stock_quantity, sku) select id, 25, 'SZ-0016' from p;

