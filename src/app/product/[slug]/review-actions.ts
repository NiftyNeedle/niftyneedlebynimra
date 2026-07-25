"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ReviewState {
  ok?: boolean;
  error?: string;
}

export async function submitReview(
  _prev: ReviewState,
  formData: FormData,
): Promise<ReviewState> {
  const productId = String(formData.get("product_id") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const rating = parseInt(String(formData.get("rating") ?? "0"), 10);
  const body = String(formData.get("body") ?? "").trim();

  if (!productId) return { error: "This product can't be reviewed yet." };
  if (!author) return { error: "Please add your name." };
  if (!(rating >= 1 && rating <= 5)) return { error: "Please pick a star rating." };
  if (!body) return { error: "Please write a short review." };

  try {
    const admin = createAdminClient();
    const { error } = await admin
      .from("reviews")
      .insert({ product_id: productId, author, rating, body });
    if (error) return { error: error.message };

    // Recompute this product's average rating + review count.
    const { data: rows } = await admin
      .from("reviews")
      .select("rating")
      .eq("product_id", productId);
    const ratings = (rows ?? []).map((r) => r.rating as number);
    const count = ratings.length;
    const avg = count
      ? Math.round((ratings.reduce((n, r) => n + r, 0) / count) * 10) / 10
      : 5.0;
    await admin
      .from("products")
      .update({ rating: avg, review_count: count })
      .eq("id", productId);

    if (slug) revalidatePath(`/product/${slug}`);
    revalidatePath("/shop");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Couldn't submit your review.",
    };
  }
}
