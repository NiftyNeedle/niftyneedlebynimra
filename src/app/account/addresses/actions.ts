"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AddressState {
  ok?: boolean;
  error?: string;
}

async function uid() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, userId: data.user?.id ?? null };
}

export async function upsertAddress(
  _prev: AddressState,
  formData: FormData,
): Promise<AddressState> {
  const { supabase, userId } = await uid();
  if (!userId) return { error: "Please sign in." };

  const id = String(formData.get("id") ?? "").trim();
  const row = {
    label: String(formData.get("label") ?? "").trim() || "Address",
    name: String(formData.get("name") ?? "").trim(),
    line: String(formData.get("line") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    postal_code: String(formData.get("postal_code") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    is_default: formData.get("is_default") === "on",
  };

  let savedId = id;
  if (id) {
    const { error } = await supabase
      .from("addresses")
      .update(row)
      .eq("id", id)
      .eq("user_id", userId);
    if (error) return { error: error.message };
  } else {
    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...row, user_id: userId })
      .select("id")
      .single();
    if (error) return { error: error.message };
    savedId = data.id as string;
  }

  // Ensure only one default.
  if (row.is_default && savedId) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", userId)
      .neq("id", savedId);
  }

  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function deleteAddress(id: string): Promise<AddressState> {
  const { supabase, userId } = await uid();
  if (!userId) return { error: "Please sign in." };
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function setDefaultAddress(id: string): Promise<AddressState> {
  const { supabase, userId } = await uid();
  if (!userId) return { error: "Please sign in." };
  await supabase
    .from("addresses")
    .update({ is_default: false })
    .eq("user_id", userId);
  const { error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) return { error: error.message };
  revalidatePath("/account/addresses");
  return { ok: true };
}
