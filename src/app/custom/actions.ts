"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewCustomOrder } from "@/lib/email";

export interface CustomOrderState {
  ok?: boolean;
  error?: string;
}

const BUCKET = "custom-order-images";
const MAX_FILES = 10;

function str(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s || null;
}

export async function submitCustomOrder(
  _prev: CustomOrderState,
  formData: FormData,
): Promise<CustomOrderState> {
  try {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!name || !email) {
      return { error: "Please add your name and email so we can reply." };
    }

    const admin = createAdminClient();

    // Upload reference images (if any) to a public Storage bucket.
    const files = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File && f.size > 0)
      .slice(0, MAX_FILES);

    const reference_images: string[] = [];
    if (files.length) {
      await admin.storage.createBucket(BUCKET, { public: true }).catch(() => {});
      let i = 0;
      for (const file of files) {
        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${Date.now()}-${i++}-${Math.round(Math.random() * 1e6)}.${ext}`;
        const { error } = await admin.storage
          .from(BUCKET)
          .upload(path, file, {
            contentType: file.type || "image/jpeg",
            upsert: true,
          });
        if (!error) {
          reference_images.push(
            admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl,
          );
        }
      }
    }

    const quantityRaw = String(formData.get("quantity") ?? "").trim();
    const quantity = quantityRaw ? parseInt(quantityRaw, 10) || null : null;

    const title = str(formData.get("title"));
    const productType = str(formData.get("product_type"));

    const { error } = await admin.from("custom_orders").insert({
      status: "New",
      title,
      product_type: productType,
      occasion: str(formData.get("occasion")),
      description,
      colors: str(formData.get("colors")),
      size: str(formData.get("size")),
      budget: str(formData.get("budget")),
      deadline: str(formData.get("deadline")),
      quantity,
      gift_wrapping: str(formData.get("gift_wrapping")),
      pinterest: str(formData.get("pinterest")),
      instagram: str(formData.get("instagram")),
      special_instructions: str(formData.get("special_instructions")),
      name,
      email,
      phone: str(formData.get("phone")),
      country: str(formData.get("country")),
      address: str(formData.get("address")),
      preferred_contact: str(formData.get("preferred_contact")),
      reference_images,
    });

    if (error) return { error: error.message };

    await notifyNewCustomOrder({
      name,
      email,
      title,
      productType,
      description,
    });

    return { ok: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Something went wrong. Please try again.",
    };
  }
}
