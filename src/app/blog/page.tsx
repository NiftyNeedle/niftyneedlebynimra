import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight, Clock } from "lucide-react";
import { getPosts } from "@/lib/blog";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Crochet care tips, gift guides, behind-the-scenes stories, and handmade inspiration from the Nifty Needle studio.",
};

// Always reflect the latest posts published from the admin panel.
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="Journal"
          title="Stories from the studio"
          description="Crochet care, gift guides, and behind-the-scenes peeks into handmade life."
          crumbs={[{ label: "Blog" }]}
        />
        <div className="section-px mx-auto max-w-3xl py-24 text-center">
          <p className="text-lg text-muted">
            No stories yet — new posts are on the way. Check back soon!
          </p>
        </div>
      </>
    );
  }

  const [featured, ...rest] = posts;
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Stories from the studio"
        description="Crochet care, gift guides, and behind-the-scenes peeks into handmade life."
        crumbs={[{ label: "Blog" }]}
      />

      <div className="section-px mx-auto max-w-[90rem] py-12">
        {/* Featured */}
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-[2rem] border border-border bg-surface shadow-[var(--shadow-soft)] transition-shadow hover:shadow-[var(--shadow-lift)] md:grid-cols-2"
          >
            <div
              className="min-h-64 bg-cover bg-center md:min-h-full"
              style={
                featured.imageUrl
                  ? { backgroundImage: `url(${featured.imageUrl})` }
                  : { background: featured.swatch }
              }
            />
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {featured.category}
              </span>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-foreground md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-muted">{featured.excerpt}</p>
              <div className="mt-5 flex items-center gap-4 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {featured.readMinutes} min read
                </span>
                <span>{featured.date}</span>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 font-medium text-accent">
                Read article
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </div>
          </Link>
        </Reveal>

        {/* Grid */}
        {rest.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} index={i}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
                >
                  <div
                    className="h-48 bg-cover bg-center"
                    style={
                      post.imageUrl
                        ? { backgroundImage: `url(${post.imageUrl})` }
                        : { background: post.swatch }
                    }
                  />
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {post.category}
                    </span>
                    <h3 className="mt-2 font-serif text-xl text-foreground">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-muted">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readMinutes} min read · {post.date}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
