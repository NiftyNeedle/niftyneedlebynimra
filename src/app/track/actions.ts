"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface TrackedOrder {
  order_number: string;
  status: string;
  created_at: string;
  tracking: string | null;
  total: number;
  currency: string;
  items: { name: string; quantity: number }[];
}

export async function lookupOrder(
  orderNumber: string,
): Promise<TrackedOrder | null> {
  let num = orderNumber.trim().toUpperCase().replace(/\s+/g, "");
  if (!num) return null;
  // Accept the code with or without the "NN-" prefix.
  if (!num.startsWith("NN-")) num = "NN-" + num;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("order_number,status,created_at,tracking,total,currency,items")
      .eq("order_number", num)
      .neq("status", "Pending payment")
      .eq("digital_only", false)
      .maybeSingle();
    return (data as TrackedOrder) ?? null;
  } catch {
    return null;
  }
}
