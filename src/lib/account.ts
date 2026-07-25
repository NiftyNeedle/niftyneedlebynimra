import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface MyOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface MyOrder {
  id: string;
  order_number: string;
  status: string;
  total: number;
  currency: string;
  tracking: string | null;
  created_at: string;
  items: MyOrderItem[];
}

async function currentUserId(): Promise<string | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function getMyOrders(): Promise<MyOrder[]> {
  const uid = await currentUserId();
  if (!uid) return [];
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    return (data as MyOrder[]) ?? [];
  } catch {
    return [];
  }
}

export async function getMyWishlistCount(): Promise<number> {
  const uid = await currentUserId();
  if (!uid) return 0;
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("wishlists")
      .select("*", { count: "exact", head: true })
      .eq("user_id", uid);
    return count ?? 0;
  } catch {
    return 0;
  }
}
