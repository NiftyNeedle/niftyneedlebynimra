"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateOrderStatus(id: string, status: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("orders").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}

export async function setOrderTracking(id: string, tracking: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("orders")
    .update({ tracking: tracking.trim() || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
}
