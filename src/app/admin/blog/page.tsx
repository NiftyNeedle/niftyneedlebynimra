import { createAdminClient } from "@/lib/supabase/admin";
import { BlogManager, type AdminPost } from "@/components/admin/blog-manager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  let posts: AdminPost[] = [];
  let notSetUp = false;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, category, content, image_url, published, created_at",
      )
      .order("created_at", { ascending: false });
    if (error) throw error;
    posts = (data as AdminPost[]) ?? [];
  } catch {
    // blog_posts table / admin credentials not set up yet.
    notSetUp = true;
  }

  return <BlogManager posts={posts} notSetUp={notSetUp} />;
}
