import { createAdminClient } from "@/lib/supabase/admin";
import { CouponsManager, type AdminCoupon } from "@/components/admin/coupons-manager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  let coupons: AdminCoupon[] = [];
  let notSetUp = false;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("coupons")
      .select("id, code, rate, description, active")
      .order("created_at", { ascending: true });
    if (error) throw error;
    coupons = (data as AdminCoupon[]) ?? [];
  } catch {
    // coupons table not set up yet → show a real empty/setup state, NOT
    // synthetic built-in rows the admin can't delete.
    notSetUp = true;
  }

  return <CouponsManager coupons={coupons} notSetUp={notSetUp} />;
}
