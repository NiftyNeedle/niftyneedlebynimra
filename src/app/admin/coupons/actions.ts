"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CouponState {
  ok?: boolean;
  error?: string;
}

export async function upsertCoupon(
  _prev: CouponState,
  formData: FormData,
): Promise<CouponState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();

    const id = String(formData.get("id") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim().toUpperCase();
    if (!code) return { error: "A coupon code is required." };

    const percent = parseFloat(String(formData.get("percent") ?? ""));
    if (Number.isNaN(percent) || percent <= 0 || percent > 100)
      return { error: "Enter a discount percent between 1 and 100." };

    const rate = Math.round(percent) / 100;
    const description =
      String(formData.get("description") ?? "").trim() ||
      `${Math.round(percent)}% off`;
    const active = formData.get("active") === "on";

    const row = { code, rate, description, active };

    if (id) {
      const { error } = await admin.from("coupons").update(row).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("coupons").insert(row);
      if (error)
        return {
          error:
            error.code === "23505"
              ? "That code already exists."
              : error.message,
        };
    }
    revalidatePath("/admin/coupons");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function toggleCoupon(id: string, active: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("coupons").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from("coupons").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}
