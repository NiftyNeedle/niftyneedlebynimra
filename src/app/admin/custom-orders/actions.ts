"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateCustomOrderStatus(id: string, status: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("custom_orders")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/custom-orders");
}

export async function deleteCustomOrder(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("custom_orders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/custom-orders");
}
