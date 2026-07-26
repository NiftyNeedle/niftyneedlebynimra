import { createAdminClient } from "@/lib/supabase/admin";

/** Recompute a product's rating + review_count from its APPROVED reviews. */
export async function recomputeProductRating(productId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("approved", true);
  const ratings = (data ?? []).map((r) => r.rating as number);
  const count = ratings.length;
  const avg = count
    ? Math.round((ratings.reduce((n, r) => n + r, 0) / count) * 10) / 10
    : 5.0;
  await admin
    .from("products")
    .update({ rating: avg, review_count: count })
    .eq("id", productId);
}
