import { BadgeCheck, Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Testimonials() {
  return (
    <section className="section-px mx-auto max-w-[90rem] py-24">
      <SectionHeading
        eyebrow="Kind Words"
        title="Kind words from customers"
        description="A few lovely notes from people I've made pieces for."
        className="mx-auto mb-14"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} index={i}>
            <figure className="flex h-full flex-col rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-soft)]">
              <Quote className="h-8 w-8 text-pink" />
              <div className="mt-4 flex text-accent">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-foreground/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-muted font-serif text-sm font-semibold text-primary">
                  {t.initials}
                </span>
                <span className="flex flex-col">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {t.name}
                    {t.verified && (
                      <BadgeCheck className="h-4 w-4 text-sage-deep" />
                    )}
                  </span>
                  <span className="text-xs text-muted">{t.location}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
