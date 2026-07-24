import { ArrowRight, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

export function CustomCta() {
  return (
    <section className="section-px mx-auto max-w-[90rem] py-24">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-surface p-10 md:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(120deg,transparent,#f3d7d2_60%,#d3a7a1)] opacity-60" />
          <div className="relative max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Fully Custom Orders
            </span>
            <h2 className="mt-5 text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">
              Dreamed something we don&apos;t make yet?
            </h2>
            <p className="mt-4 text-balance text-muted md:text-lg">
              Share your idea — a colour palette, a beloved pet, a wedding
              keepsake — and we&apos;ll bring it to life stitch by stitch. Upload
              reference photos, set your budget, and we&apos;ll craft something
              entirely yours.
            </p>
            <ButtonLink href="/custom" size="lg" className="group mt-8">
              Create Your Own Crochet
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
