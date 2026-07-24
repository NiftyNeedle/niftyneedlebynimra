import type { ReactNode } from "react";

export interface Section {
  heading: string;
  body: string[];
}

export function Prose({
  intro,
  sections,
  updated,
  children,
}: {
  intro?: string;
  sections?: Section[];
  updated?: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-px mx-auto max-w-3xl py-12">
      {updated && (
        <p className="mb-8 text-sm text-muted">Last updated: {updated}</p>
      )}
      {intro && (
        <p className="mb-8 text-lg leading-relaxed text-foreground/90">
          {intro}
        </p>
      )}
      {sections?.map((s) => (
        <section key={s.heading} className="mb-8">
          <h2 className="mb-3 font-serif text-2xl font-semibold text-foreground">
            {s.heading}
          </h2>
          {s.body.map((p, i) => (
            <p key={i} className="mb-3 leading-relaxed text-muted">
              {p}
            </p>
          ))}
        </section>
      ))}
      {children}
    </div>
  );
}
