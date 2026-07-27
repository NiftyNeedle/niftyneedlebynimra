"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  PATTERN_IMAGE_BUCKET,
  PATTERN_PDF_BUCKET,
} from "@/lib/patterns-fulfill";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface PatternActionState {
  ok?: boolean;
  error?: string;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
  await admin.storage
    .createBucket(PATTERN_IMAGE_BUCKET, { public: true })
    .catch(() => {});
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${slug}-${Date.now()}.${ext}`;
  const { error } = await admin.storage
    .from(PATTERN_IMAGE_BUCKET)
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });
  if (error) throw new Error("Image upload failed: " + error.message);
  return admin.storage.from(PATTERN_IMAGE_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

async function uploadPdf(
  admin: SupabaseClient,
  file: File,
  slug: string,
): Promise<string> {
  // PRIVATE bucket — never public. Returns the storage PATH, not a URL.
  await admin.storage
    .createBucket(PATTERN_PDF_BUCKET, { public: false })
    .catch(() => {});
  const path = `${slug}-${Date.now()}.pdf`;
  const { error } = await admin.storage
    .from(PATTERN_PDF_BUCKET)
    .upload(path, file, {
      contentType: "application/pdf",
      upsert: true,
    });
  if (error) throw new Error("PDF upload failed: " + error.message);
  return path;
}

export async function upsertPattern(
  _prev: PatternActionState,
  formData: FormData,
): Promise<PatternActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();

    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { error: "A title is required." };

    let slug = String(formData.get("slug") ?? "").trim();
    slug = slug ? slugify(slug) : slugify(title);

    const isFree = formData.get("is_free") === "on";
    const priceRaw = toNum(formData.get("price"));
    const price = isFree ? 0 : priceRaw ?? 0;
    if (!isFree && !(price > 0)) {
      return { error: "Set a price, or mark the pattern as free." };
    }

    const imageFile = formData.get("image");
    const imageUrl =
      imageFile instanceof File && imageFile.size > 0
        ? await uploadImage(admin, imageFile, slug)
        : null;

    const pdfFile = formData.get("pdf");
    const pdfPath =
      pdfFile instanceof File && pdfFile.size > 0
        ? await uploadPdf(admin, pdfFile, slug)
        : null;

    const row: Record<string, unknown> = {
      slug,
      title,
      description: String(formData.get("description") ?? "").trim(),
      finished_size: String(formData.get("finished_size") ?? "").trim(),
      difficulty: String(formData.get("difficulty") ?? "").trim(),
      price,
      is_free: isFree,
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    };
    if (imageUrl) row.image_url = imageUrl;
    if (pdfPath) row.pdf_path = pdfPath;

    if (id) {
      const { error } = await admin.from("patterns").update(row).eq("id", id);
      if (error) return { error: error.message };
    } else {
      if (!pdfPath) return { error: "Please upload the pattern PDF." };
      const { error } = await admin.from("patterns").insert(row);
      if (error)
        return {
          error:
            error.code === "23505"
              ? "A pattern with that URL slug already exists. Choose a different title/slug."
              : error.message,
        };
    }

    revalidatePath("/patterns");
    revalidatePath(`/patterns/${slug}`);
    revalidatePath("/admin/patterns");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function togglePatternPublished(
  id: string,
  published: boolean,
): Promise<PatternActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("patterns")
      .update({ published, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/patterns");
    revalidatePath("/admin/patterns");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Update failed." };
  }
}

export async function deletePattern(id: string): Promise<PatternActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("patterns").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidatePath("/patterns");
    revalidatePath("/admin/patterns");
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}
