"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface BlogActionState {
  ok?: boolean;
  error?: string;
}

const BUCKET = "blog-images";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    .upload(path, file, {
      contentType: file.type || "image/jpeg",
      upsert: true,
    });
  if (error) throw new Error("Image upload failed: " + error.message);
  return admin.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function upsertPost(
  _prev: BlogActionState,
  formData: FormData,
): Promise<BlogActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();

    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { error: "A title is required." };

    let slug = String(formData.get("slug") ?? "").trim();
    if (!slug) slug = slugify(title);
    else slug = slugify(slug);

    const content = String(formData.get("content") ?? "").trim();
    if (!content) return { error: "Post content can't be empty." };

    const file = formData.get("image");
    const imageUrl =
      file instanceof File && file.size > 0
        ? await uploadImage(admin, file, slug)
        : null;

    const row: Record<string, unknown> = {
      slug,
      title,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim() || "Journal",
      content,
      published: formData.get("published") === "on",
      updated_at: new Date().toISOString(),
    };
    if (imageUrl) row.image_url = imageUrl;

    if (id) {
      const { error } = await admin.from("blog_posts").update(row).eq("id", id);
      if (error) return { error: error.message };
    } else {
      const { error } = await admin.from("blog_posts").insert(row);
      if (error)
        return {
          error:
            error.code === "23505"
              ? "A post with that URL slug already exists. Choose a different title/slug."
              : error.message,
        };
    }

    revalidateBlog(slug);
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export async function togglePublished(
  id: string,
  published: boolean,
): Promise<BlogActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin
      .from("blog_posts")
      .update({ published, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { error: error.message };
    revalidateBlog();
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Update failed." };
  }
}

export async function deletePost(id: string): Promise<BlogActionState> {
  try {
    await requireAdmin();
    const admin = createAdminClient();
    const { error } = await admin.from("blog_posts").delete().eq("id", id);
    if (error) return { error: error.message };
    revalidateBlog();
    return { ok: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Delete failed." };
  }
}
