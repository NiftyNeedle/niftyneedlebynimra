import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/catalog";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

const accentBg: Record<string, string> = {
  pink: "from-pink/30 to-pink/5",
  sage: "from-sage/30 to-sage/5",
  brown: "from-brown/20 to-brown/5",
};

export async function Categories() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  if (categories.length === 0) return null;

  // Real product counts per category.
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.categorySlug, (counts.get(p.categorySlug) ?? 0) + 1);
  }

  return (
    <section className="section-px mx-auto max-w-[90rem] py-24" id="categories">
      <SectionHeading
        eyebrow="Collections"
        title="Explore our handcrafted world"
        description="From everlasting blooms to cuddly companions — find something made to be treasured."
        className="mx-auto mb-14"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((c, i) => {
          const count = counts.get(c.slug) ?? 0;
          return (
            <Reveal key={c.id} index={i % 5}>
              <Link
                href={`/shop?category=${c.slug}`}
                className={cn(
                  "group relative flex h-44 flex-col justify-between overflow-hidden rounded-3xl border border-border bg-gradient-to-br p-5 transition-all duration-500 hover:shadow-[var(--shadow-lift)] hover:-translate-y-1",
                  accentBg[c.accent],
                )}
              >
                <span className="text-4xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  {c.icon}
                </span>
                <div>
                  <h3 className="font-serif text-lg leading-tight text-foreground">
                    {c.name}
                  </h3>
                  <span className="mt-0.5 text-xs text-muted">
                    {count > 0
                      ? `${count} piece${count === 1 ? "" : "s"}`
                      : "Made for you"}
                  </span>
                </div>
                <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 -translate-y-1 translate-x-1 text-primary opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
