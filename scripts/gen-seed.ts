import { products } from "../src/lib/data";

const esc = (s: string) => s.replace(/'/g, "''");
const arr = (a: string[]) =>
  `ARRAY[${a.map((x) => `'${esc(x)}'`).join(", ")}]::text[]`;
const num = (n: number | undefined) => (n === undefined ? "NULL" : String(n));

let out = `-- Nifty Needle — product seed (generated from src/lib/data.ts)\n`;
out += `-- Run AFTER schema.sql, in the Supabase SQL Editor.\n\n`;

products.forEach((p, i) => {
  out +=
    `insert into public.products ` +
    `(slug, name, category_slug, price, sale_price, currency, rating, review_count, swatch, colors, materials, short_description, is_best_seller, is_new, customizable, in_stock, sort_order) values (\n` +
    `  '${esc(p.slug)}', '${esc(p.name)}', '${esc(p.categorySlug)}', ${p.price}, ${num(p.salePrice)}, '${p.currency}', ${p.rating}, ${p.reviewCount}, '${esc(p.swatch)}', ${arr(p.colors)}, ${arr(p.materials)}, '${esc(p.shortDescription)}', ${!!p.isBestSeller}, ${!!p.isNew}, ${!!p.customizable}, ${p.inStock}, ${i}\n` +
    `) on conflict (slug) do nothing;\n`;
});

process.stdout.write(out);
