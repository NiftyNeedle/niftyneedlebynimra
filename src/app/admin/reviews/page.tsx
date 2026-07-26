import { createAdminClient } from "@/lib/supabase/admin";
import { ReviewsManager, type AdminReview } from "@/components/admin/reviews-manager";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  let reviews: AdminReview[] = [];
  try {
    const admin = createAdminClient();
    const [{ data: rows }, { data: products }] = await Promise.all([
      admin
        .from("reviews")
        .select("id, product_id, author, rating, body, approved, created_at")
        .order("created_at", { ascending: false }),
      admin.from("products").select("id, name"),
    ]);
    const names = new Map(
      (products ?? []).map((p) => [p.id as string, p.name as string]),
    );
    reviews = (rows ?? []).map((r) => ({
      ...(r as Omit<AdminReview, "productName">),
      productName: names.get(r.product_id as string) ?? "Unknown product",
    }));
  } catch {
    reviews = [];
  }

  return <ReviewsManager reviews={reviews} />;
}
