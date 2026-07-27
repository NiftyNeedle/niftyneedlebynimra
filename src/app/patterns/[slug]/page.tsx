import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FileText, Ruler, Sparkles } from "lucide-react";
import { getPatternBySlug, patternSwatch } from "@/lib/patterns";
import { PageHeader } from "@/components/ui/page-header";
import { FreePatternForm } from "@/components/patterns/free-pattern-form";
import { AddPatternToCart } from "@/components/patterns/add-pattern-to-cart";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pattern = await getPatternBySlug(slug);
  if (!pattern) return { title: "Pattern not found" };
  return {
    title: pattern.title,
    description: pattern.description,
    openGraph: { title: pattern.title, description: pattern.description },
  };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pattern = await getPatternBySlug(slug);
  if (!pattern) notFound();

  const paragraphs = pattern.description
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow={pattern.isFree ? "Free pattern" : "PDF Pattern"}
        title={pattern.title}
        crumbs={[
          { label: "Patterns", href: "/patterns" },
          { label: pattern.title },
        ]}
      />

      <div className="section-px mx-auto max-w-6xl py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Cover */}
          <div className="overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-soft)]">
            {pattern.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pattern.imageUrl}
                alt={pattern.title}
                className="aspect-[4/3] w-full object-cover"
              />
            ) : (
              <div
                className="aspect-[4/3] w-full"
                style={{ background: patternSwatch(0) }}
              />
            )}
          </div>

          {/* Details + action */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2">
              {pattern.difficulty && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground">
                  <Sparkles className="h-3.5 w-3.5" />
                  {pattern.difficulty}
                </span>
              )}
              {pattern.finishedSize && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground">
                  <Ruler className="h-3.5 w-3.5" />
                  {pattern.finishedSize}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-foreground">
                <FileText className="h-3.5 w-3.5" />
                Digital PDF
              </span>
            </div>

            <div className="mt-6 space-y-4 text-foreground/90">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p className="text-muted">
                  A step-by-step crochet pattern delivered as a PDF.
                </p>
              )}
            </div>

            <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
              {pattern.isFree ? (
                <FreePatternForm patternId={pattern.id} title={pattern.title} />
              ) : (
                <AddPatternToCart
                  pattern={{
                    id: pattern.id,
                    slug: pattern.slug,
                    title: pattern.title,
                    price: pattern.price,
                    imageUrl: pattern.imageUrl,
                  }}
                />
              )}
            </div>

            <p className="mt-4 text-xs text-muted">
              This is a digital pattern (PDF), not a physical item. Because of
              its nature, digital patterns aren&apos;t refundable.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
