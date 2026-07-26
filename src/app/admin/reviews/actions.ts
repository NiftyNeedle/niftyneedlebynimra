"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import { recomputeProductRating } from "@/lib/reviews-recompute";

async function productIdFor(id: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("reviews")
    .select("product_id")
    .eq("id", id)
    .maybeSingle();
  return (data?.product_id as string) ?? null;
}

export async function setReviewApproved(id: string, approved: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const productId = await productIdFor(id);
  const { error } = await admin
    .from("reviews")
    .update({ approved })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (productId) await recomputeProductRating(productId);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function deleteReview(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const productId = await productIdFor(id);
  const { error } = await admin.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (productId) await recomputeProductRating(productId);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
  revalidatePath("/");
}
