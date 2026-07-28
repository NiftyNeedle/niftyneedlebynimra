import { getAdminCategories } from "@/lib/categories";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  CategoriesManager,
  type AdminCategory,
} from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories: AdminCategory[] = [];
  let notSetUp = false;
  let counts: Record<string, number> = {};

  try {
    const admin = createAdminClient();
    // Probe the table directly so we can tell "empty" from "not set up".
    const { error } = await admin.from("categories").select("id").limit(1);
    if (error) throw error;

    const cats = await getAdminCategories();
    categories = cats.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      icon: c.icon,
      accent: c.accent,
    }));

    // Count products per category for a helpful "N products" hint.
    const { data: products } = await admin
      .from("products")
      .select("category_slug")
      .eq("archived", false);
    for (const p of products ?? []) {
      const s = (p as { category_slug: string }).category_slug;
      counts[s] = (counts[s] ?? 0) + 1;
    }
  } catch {
    notSetUp = true;
    counts = {};
  }

  return (
    <CategoriesManager
      categories={categories}
      counts={counts}
      notSetUp={notSetUp}
    />
  );
}
