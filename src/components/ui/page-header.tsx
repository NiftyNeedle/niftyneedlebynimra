import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface-muted">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sage/20 blur-3xl" />
      <div className="section-px relative mx-auto max-w-[90rem] py-16 md:py-20">
        {crumbs && (
          <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-foreground">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-balance text-muted md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
