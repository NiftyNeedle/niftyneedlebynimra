"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CategoryActionState {
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

function toInt(v: FormDataEntryValue | null): number {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function revalidateAll() {
  revalidatePath("/"); // home collections grid
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function upsertCategory(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();

    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { error: "A category name is required." };

    let slug = String(formData.get("slug") ?? "").trim();
    slug = slug ? slugify(slug) : slugify(name);
    if (!slug) return { error: "Please provide a valid name or URL slug." };

    const row = {
      slug,
      name,
      description: String(formData.get("description") ?? "").trim(),
      icon: String(formData.get("icon") ?? "").trim() || "🧶",
      sort_order: toInt(formData.get("sort_order")),
    };

    if (id) {
      const { error } = await admin.from("categories").update(row).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("categories").insert(row);
      if (error)
        return {
          error:
            error.code === "23505"
              ? "A category with that URL slug already exists."
              : error.message,
        };
    }

    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function deleteCategory(id: string): Promise<CategoryActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("categories").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidateAll();
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}
