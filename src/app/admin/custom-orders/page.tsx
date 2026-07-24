import { createAdminClient } from "@/lib/supabase/admin";
import { CustomRequests, type CustomOrder } from "@/components/admin/custom-requests";

export const dynamic = "force-dynamic";

export default async function AdminCustomOrdersPage() {
  let requests: CustomOrder[] = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("custom_orders")
      .select("*")
      .order("created_at", { ascending: false });
    requests = (data as CustomOrder[]) ?? [];
  } catch {
    requests = [];
  }

  return <CustomRequests requests={requests} />;
}
