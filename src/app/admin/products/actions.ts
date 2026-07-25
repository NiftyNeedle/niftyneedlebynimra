"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface ActionState {
  ok?: boolean;
  error?: string;
}

const BUCKET = "product-images";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(v: FormDataEntryValue | null) {
  return String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toNum(v: FormDataEntryValue | null): number | null {
  const n = parseFloat(String(v));
  return Number.isNaN(n) ? null : n;
}

async function uploadImage(
  admin: SupabaseClient,
  file: File,
  slug: string,
): Promise<string> {
  // Idempotent: ignores "already exists" errors.
  await admin.storage.createBucket(BUCKET, { public: true }).catch(() => {});
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: true });
  if (error) throw new Error("Image upload failed: " + error.message);
  return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function revalidateStore(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/wishlist");
  revalidatePath("/admin/products");
  if (slug) revalidatePath(`/product/${slug}`);
}

export async function upsertProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();

    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { error: "Product name is required." };

    let slug = String(formData.get("slug") ?? "").trim();
    if (!slug) slug = slugify(name);

    const price = toNum(formData.get("price"));
    if (price === null) return { error: "A valid price is required." };

    const salePriceRaw = String(formData.get("salePrice") ?? "").trim();
    const sale_price = salePriceRaw === "" ? null : toNum(salePriceRaw);

    const file = formData.get("image");
    const imageUrl =
      file instanceof File && file.size > 0
        ? await uploadImage(admin, file, slug)
        : null;

    const customizable = formData.get("customizable") === "on";
    let customization: Record<string, unknown> | null = null;
    if (customizable) {
      try {
        const parsed = JSON.parse(String(formData.get("customization") ?? "null"));
        if (parsed && typeof parsed === "object") {
          const sanitizeOptions = (list: unknown) =>
            Array.isArray(list)
              ? list
                  .map((o) => ({
                    label: String((o as { label?: unknown }).label ?? "").trim(),
                    price: Number((o as { price?: unknown }).price) || 0,
                  }))
                  .filter((o) => o.label)
              : [];
          if (parsed.colorOptions)
            parsed.colorOptions = sanitizeOptions(parsed.colorOptions);
          if (parsed.yarnOptions)
            parsed.yarnOptions = sanitizeOptions(parsed.yarnOptions);
          if (parsed.sizeOptions)
            parsed.sizeOptions = sanitizeOptions(parsed.sizeOptions);
          customization = parsed;
        }
      } catch {
        customization = null;
      }
    }

    // Colours come from the customization colour options (labels drive the
    // shop filter). Rating/review_count are dynamic — never set here.
    const colorLabels = Array.isArray(
      (customization as { colorOptions?: { label: string }[] } | null)?.colorOptions,
    )
      ? (customization as { colorOptions: { label: string }[] }).colorOptions.map(
          (o) => o.label,
        )
      : [];

    const row: Record<string, unknown> = {
      slug,
      name,
      category_slug: String(formData.get("category_slug") ?? "accessories"),
      price,
      sale_price,
      currency: String(formData.get("currency") ?? "USD"),
      short_description: String(formData.get("short_description") ?? ""),
      swatch:
        String(formData.get("swatch") ?? "").trim() ||
        "linear-gradient(135deg,#dde4ee,#8fa57e)",
      colors: colorLabels,
      materials: parseList(formData.get("materials")),
      is_best_seller: formData.get("is_best_seller") === "on",
      is_new: formData.get("is_new") === "on",
      customizable,
      customization,
      in_stock: formData.get("in_stock") === "on",
    };
    if (imageUrl) row.image_url = imageUrl;

    if (id) {
      const { error } = await admin.from("products").update(row).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("products").insert(row);
      if (error)
        return {
          error:
            error.code === "23505"
              ? "A product with that URL slug already exists. Choose a different name/slug."
              : error.message,
        };
    }

    revalidateStore(slug);
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteProduct(id: string): Promise<ActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("products").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidateStore();
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}
