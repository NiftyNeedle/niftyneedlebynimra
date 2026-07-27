import { ArrowRight, FileText } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getPatterns } from "@/lib/patterns";
import { PatternCard } from "@/components/patterns/pattern-card";

export async function PatternsTeaser() {
  const patterns = (await getPatterns()).slice(0, 3);

  return (
    <section className="section-px mx-auto max-w-[90rem] py-24">
      <div className="mb-14 flex flex-col items-end justify-between gap-6 md:flex-row">
        <SectionHeading
          align="left"
          eyebrow="Make it yourself"
          title="Crochet patterns"
          description="Prefer to make your own? Download step-by-step PDF patterns — a few are completely free. Your file arrives straight in your inbox."
        />
        <ButtonLink href="/patterns" variant="outline" className="shrink-0">
          Browse patterns
        </ButtonLink>
      </div>

      {patterns.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((p, i) => (
            <Reveal key={p.id} index={i % 3}>
              <PatternCard pattern={p} index={i} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface p-10 text-center md:p-16">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-sage/25 via-sage/5 to-transparent" />
            <div className="relative mx-auto max-w-xl">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface-muted text-primary">
                <FileText className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-serif text-2xl font-semibold text-foreground md:text-3xl">
                Digital patterns are coming soon
              </h3>
              <p className="mt-3 text-balance text-muted">
                Instant-download crochet PDFs — including free ones — will land
                here shortly. Check back soon!
              </p>
              <ButtonLink href="/patterns" className="group mt-7">
                See the patterns page
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
