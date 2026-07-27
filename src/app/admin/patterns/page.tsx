import { createAdminClient } from "@/lib/supabase/admin";
import {
  PatternsManager,
  type AdminPattern,
} from "@/components/admin/patterns-manager";

export const dynamic = "force-dynamic";

export default async function AdminPatternsPage() {
  let patterns: AdminPattern[] = [];
  let notSetUp = false;
  let salesTotal = 0;
  let salesCount = 0;

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("patterns")
      .select(
        "id, slug, title, description, finished_size, difficulty, price, is_free, image_url, pdf_path, published, created_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    type Row = Omit<AdminPattern, "has_pdf"> & { pdf_path: string | null };
    patterns = ((data as Row[]) ?? []).map(({ pdf_path, ...p }) => ({
      ...p,
      has_pdf: Boolean(pdf_path),
    }));

    const { data: sales } = await admin
      .from("pattern_sales")
      .select("amount");
    if (sales) {
      salesCount = sales.length;
      salesTotal = sales.reduce(
        (n, s) => n + (Number((s as { amount: number }).amount) || 0),
        0,
      );
    }
  } catch {
    notSetUp = true;
  }

  return (
    <PatternsManager
      patterns={patterns}
      notSetUp={notSetUp}
      salesCount={salesCount}
      salesTotal={salesTotal}
    />
  );
}
