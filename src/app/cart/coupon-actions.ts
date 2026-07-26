"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { findCoupon } from "@/lib/coupons";

export interface ValidatedCoupon {
  code: string;
  rate: number;
}

/** Validates a coupon code against the DB (active only). Falls back to the
 *  built-in codes only when the database isn't configured. */
export async function validateCoupon(
  code: string,
): Promise<ValidatedCoupon | null> {
  const c = code.trim().toUpperCase();
  if (!c) return null;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    const fb = findCoupon(c);
    return fb ? { code: fb.code, rate: fb.rate } : null;
  }

  const { data, error } = await admin
    .from("coupons")
    .select("code, rate")
    .eq("code", c)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    // Table not created yet → fall back to built-in codes.
    const fb = findCoupon(c);
    return fb ? { code: fb.code, rate: fb.rate } : null;
  }
  return data ? { code: data.code as string, rate: Number(data.rate) } : null;
}
