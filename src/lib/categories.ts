import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "./supabase/admin";
import type { Category } from "./types";
import { categories as staticCategories } from "./data";

/**
 * Category data access. Reads from Supabase when configured and falls back
 * to the built-in list only when the DB isn't set up or errors — a
 * genuinely empty table stays empty (no resurrected rows).
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key) : null;

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  accent: string;
  sort_order: number;
}

function mapRow(r: CategoryRow): Category {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description ?? "",
    icon: r.icon || "🧶",
    accent: (["pink", "sage", "brown"].includes(r.accent)
      ? r.accent
      : "sage") as Category["accent"],
    productCount: 0,
  };
}

/** Storefront category list (with graceful fallback to built-ins). */
export async function getCategories(): Promise<Category[]> {
  if (!db) return staticCategories;
  const { data, error } = await db
    .from("categories")
    .select("id,slug,name,description,icon,accent,sort_order")
    .order("sort_order", { ascending: true });
  if (error) return staticCategories; // table not set up yet
  return (data as CategoryRow[]).map(mapRow);
}

/** Admin category list — real DB only, never a synthetic fallback. */
export async function getAdminCategories(): Promise<Category[]> {
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("categories")
      .select("id,slug,name,description,icon,accent,sort_order")
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    return (data as CategoryRow[]).map(mapRow);
  } catch {
    return [];
  }
}
