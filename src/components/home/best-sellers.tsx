import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { getBestSellers } from "@/lib/catalog";
import { ProductCard } from "./product-card";

export async function BestSellers() {
  const bestSellers = await getBestSellers(4);
  return (
    <section className="bg-surface-muted py-24">
      <div className="section-px mx-auto max-w-[90rem]">
        <div className="mb-14 flex flex-col items-end justify-between gap-6 md:flex-row">
          <SectionHeading
            align="left"
            eyebrow="Best Sellers"
            title="A few favourites"
            description="Some of my most-loved pieces — each one handmade to order and ready to become someone's favourite."
          />
          <ButtonLink href="/shop" variant="outline" className="shrink-0">
            View all products
          </ButtonLink>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <Reveal key={p.id} index={i % 4}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
