"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  MAX_PRODUCT_IMAGES,
  type CustomizationField,
  type CustomizationFieldType,
  type ProductCustomization,
} from "@/lib/types";
import { fieldId } from "@/lib/customization";

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
  index: number,
): Promise<string> {
  // Idempotent: ignores "already exists" errors.
  await admin.storage.createBucket(BUCKET, { public: true }).catch(() => {});
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${slug}-${Date.now()}-${index}.${ext}`;
  const { error } = await admin.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: true });
  if (error) throw new Error("Image upload failed: " + error.message);
  return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

const FIELD_TYPES: CustomizationFieldType[] = ["choice", "text", "note"];

/**
 * Rebuild the admin's customization fields from scratch, trusting nothing
 * from the client: labels are required, choice fields need at least one
 * choice, prices fall back to 0 (an empty price box means "no charge"),
 * and duplicate labels are dropped because the label is the key a cart
 * line stores its answer under.
 */
function sanitizeCustomization(raw: unknown): ProductCustomization | null {
  const list = (raw as { fields?: unknown } | null)?.fields;
  if (!Array.isArray(list)) return null;

  const seen = new Set<string>();
  const fields: CustomizationField[] = [];

  for (const item of list) {
    const src = (item ?? {}) as Record<string, unknown>;
    const label = String(src.label ?? "").trim();
    if (!label || seen.has(label.toLowerCase())) continue;

    const type = FIELD_TYPES.includes(src.type as CustomizationFieldType)
      ? (src.type as CustomizationFieldType)
      : "choice";
    const field: CustomizationField = { id: fieldId(label), label, type };

    if (type === "choice") {
      const options = (Array.isArray(src.options) ? src.options : [])
        .map((o) => {
          const opt = (o ?? {}) as Record<string, unknown>;
          return {
            label: String(opt.label ?? "").trim(),
            price: Math.max(0, Number(opt.price) || 0),
          };
        })
        .filter((o) => o.label);
      // A choice field with nothing to choose from would render an empty
      // control, so drop it rather than save it.
      if (!options.length) continue;
      field.options = options;
    } else {
      const placeholder = String(src.placeholder ?? "").trim();
      if (placeholder) field.placeholder = placeholder;
      if (src.required === true) field.required = true;
    }

    seen.add(label.toLowerCase());
    fields.push(field);
  }

  // Always return a `fields` array (even empty) once the client sent one:
  // that marks the product as using the dynamic shape, so the storefront
  // shows nothing rather than falling back to the old fixed field set.
  return { fields };
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

    // ── Gallery: the photos the admin kept (in order) plus any new
    //    uploads, capped at MAX_PRODUCT_IMAGES. An empty list means the
    //    admin removed every photo, so the swatch takes over again. ──
    const kept = formData
      .getAll("existingImages")
      .map((v) => String(v).trim())
      .filter(Boolean);
    const newFiles = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File && f.size > 0);

    const gallery = [...new Set(kept)].slice(0, MAX_PRODUCT_IMAGES);
    for (const file of newFiles.slice(0, MAX_PRODUCT_IMAGES - gallery.length)) {
      gallery.push(await uploadImage(admin, file, slug, gallery.length));
    }

    const customizable = formData.get("customizable") === "on";
    let customization: ProductCustomization | null = null;
    if (customizable) {
      try {
        customization = sanitizeCustomization(
          JSON.parse(String(formData.get("customization") ?? "null")),
        );
      } catch {
        customization = null;
      }
    }

    // The shop's colour filter reads products.colors, so fill it from a
    // colour-ish choice field when the admin defined one (fields are free
    // form, so this is a best-effort match, not a requirement).
    // Rating/review_count are dynamic — never set here.
    const colorLabels =
      customization?.fields
        ?.find((f) => f.type === "choice" && /colou?rs?/i.test(f.label))
        ?.options?.map((o) => o.label) ?? [];

    const row: Record<string, unknown> = {
      slug,
      name,
      category_slug: String(formData.get("category_slug") ?? "accessories"),
      price,
      sale_price,
      currency: String(formData.get("currency") ?? "EUR"),
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
      image_urls: gallery,
      // Kept in sync with the first gallery photo — cards, cart thumbnails
      // and emails still read this single column.
      image_url: gallery[0] ?? null,
    };

    const write = (payload: Record<string, unknown>) =>
      id
        ? admin.from("products").update(payload).eq("id", id)
        : admin.from("products").insert(payload);

    let { error } = await write(row);
    if (error?.code === "42703") {
      // supabase/product-gallery.sql hasn't been run yet — save the cover
      // photo only so the admin keeps working until the migration lands.
      const { image_urls: _gallery, ...withoutGallery } = row;
      void _gallery;
      ({ error } = await write(withoutGallery));
    }
    if (error)
      return {
        error:
          error.code === "23505"
            ? "A product with that URL slug already exists. Choose a different name/slug."
            : error.message,
      };

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
