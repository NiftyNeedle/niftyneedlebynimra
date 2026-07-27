import type { Metadata } from "next";
import { getPatterns } from "@/lib/patterns";
import { PageHeader } from "@/components/ui/page-header";
import { PatternCard } from "@/components/patterns/pattern-card";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Crochet Patterns",
  description:
    "Digital crochet patterns as instant-download PDFs — plus a few free ones. Make your own handmade treasures with Nifty Needle's step-by-step guides.",
};

// Reflect patterns added/edited from the admin panel right away.
export const revalidate = 0;

export default async function PatternsPage() {
  const patterns = await getPatterns();

  return (
    <>
      <PageHeader
        eyebrow="Make it yourself"
        title="Crochet Patterns"
        description="Instant-download PDF patterns with step-by-step guidance — some paid, some free. Your PDF arrives straight in your inbox."
        crumbs={[{ label: "Patterns" }]}
      />

      <div className="section-px mx-auto max-w-[90rem] py-12">
        {patterns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-24 text-center">
            <p className="text-lg text-muted">
              New patterns are on their way — check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {patterns.map((p, i) => (
              <Reveal key={p.id} index={i}>
                <PatternCard pattern={p} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
