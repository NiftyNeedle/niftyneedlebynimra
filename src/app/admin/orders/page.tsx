import { createAdminClient } from "@/lib/supabase/admin";
import { OrdersTable, type AdminOrder } from "@/components/admin/orders-table";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  let orders: AdminOrder[] = [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    orders = (data as AdminOrder[]) ?? [];
  } catch {
    orders = [];
  }
  return <OrdersTable orders={orders} />;
}
