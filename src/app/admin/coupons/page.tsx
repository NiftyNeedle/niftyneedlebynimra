import { createAdminClient } from "@/lib/supabase/admin";
import { COUPONS } from "@/lib/coupons";
import { CouponsManager, type AdminCoupon } from "@/components/admin/coupons-manager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  let coupons: AdminCoupon[] = [];
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("coupons")
      .select("id, code, rate, description, active")
      .order("created_at", { ascending: true });
    if (error) throw error;
    coupons = (data as AdminCoupon[]) ?? [];
  } catch {
    // DB/coupons table not set up yet → show the built-in codes read-only.
    coupons = COUPONS.map((c, i) => ({
      id: `builtin-${i}`,
      code: c.code,
      rate: c.rate,
      description: c.description,
      active: true,
    }));
  }

  return <CouponsManager coupons={coupons} />;
}
