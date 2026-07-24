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
  let num = orderNumber.trim().toUpperCase();
  if (!num) return null;
  if (/^\d+$/.test(num)) num = "NN-" + num;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("order_number,status,created_at,tracking,total,currency,items")
      .eq("order_number", num)
      .maybeSingle();
    return (data as TrackedOrder) ?? null;
  } catch {
    return null;
  }
}
