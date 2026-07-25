import { createClient } from "@supabase/supabase-js";

export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  created_at: string;
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key) : null;

export async function getReviewsForProduct(
  productId: string,
): Promise<Review[]> {
  if (!db) return [];
  const { data, error } = await db
    .from("reviews")
    .select("id, author, rating, body, created_at")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data as Review[];
}
