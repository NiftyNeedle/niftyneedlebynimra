import { createClient } from "@supabase/supabase-js";
import type { Product, ProductCustomization } from "./types";
import {
  products as mockProducts,
  getProductBySlug as mockGetBySlug,
  getRelatedProducts as mockRelated,
} from "./data";

/**
 * Catalog data access. Reads products from Supabase when configured,
 * and transparently falls back to the mock data in `data.ts` otherwise
 * (or on any error) — so the site never breaks before the DB is wired.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key) : null;

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category_slug: string;
  price: number;
  sale_price: number | null;
  currency: string;
  rating: number;
  review_count: number;
  swatch: string;
  image_url: string | null;
  colors: string[];
  materials: string[];
  short_description: string;
  is_best_seller: boolean;
  is_new: boolean;
  customizable: boolean;
  customization: ProductCustomization | null;
  in_stock: boolean;
}

function mapRow(r: ProductRow): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    categorySlug: r.category_slug,
    price: Number(r.price),
    salePrice: r.sale_price == null ? undefined : Number(r.sale_price),
    currency: r.currency as Product["currency"],
    rating: Number(r.rating),
    reviewCount: r.review_count,
    images: [{ url: r.image_url ?? "", alt: r.name }],
    imageUrl: r.image_url ?? undefined,
    swatch: r.swatch,
    colors: r.colors ?? [],
    materials: r.materials ?? [],
    shortDescription: r.short_description,
    isBestSeller: r.is_best_seller,
    isNew: r.is_new,
    customizable: r.customizable,
    customization: r.customization ?? undefined,
    inStock: r.in_stock,
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!db) return mockProducts;
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("archived", false)
    .order("sort_order", { ascending: true });
  if (error || !data || data.length === 0) return mockProducts;
  return (data as ProductRow[]).map(mapRow);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.isBestSeller).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!db) return mockGetBySlug(slug) ?? null;
  const { data, error } = await db
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("archived", false)
    .maybeSingle();
  if (error || !data) return mockGetBySlug(slug) ?? null;
  return mapRow(data as ProductRow);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const all = await getProducts();
  if (all === mockProducts) return mockRelated(product, limit);
  return all
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .concat(all.filter((p) => p.categorySlug !== product.categorySlug))
    .filter((p) => p.id !== product.id)
    .slice(0, limit);
}

export function colorsFrom(products: Product[]): string[] {
  return Array.from(new Set(products.flatMap((p) => p.colors))).sort();
}
