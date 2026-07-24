import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { blogPosts, getPostBySlug } from "@/lib/blog";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <PageHeader
        eyebrow={post.category}
        title={post.title}
        crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />
      <article className="section-px mx-auto max-w-3xl py-12">
        <div className="flex items-center gap-4 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readMinutes} min read
          </span>
          <span>{post.date}</span>
          <span>· by {post.author}</span>
        </div>

        <div
          className="my-8 h-72 rounded-[2rem]"
          style={{ background: post.swatch }}
        />

        <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-surface-muted/60 p-8 text-center">
          <h3 className="font-serif text-2xl text-foreground">
            Ready to find your handmade treasure?
          </h3>
          <p className="mt-2 text-muted">
            Explore our collection or start a fully custom order.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <ButtonLink href="/shop">Shop now</ButtonLink>
            <ButtonLink href="/custom" variant="outline">
              Custom order
            </ButtonLink>
          </div>
        </div>
      </article>

      <div className="section-px mx-auto max-w-3xl pb-16">
        <h2 className="mb-5 font-serif text-2xl text-foreground">
          Keep reading
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {related.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="h-36" style={{ background: p.swatch }} />
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {p.category}
                </span>
                <h3 className="mt-1 font-serif text-lg text-foreground">
                  {p.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
