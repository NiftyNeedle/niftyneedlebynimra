import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ShopClient } from "@/components/shop/shop-client";
import { getProducts } from "@/lib/catalog";
import { getCategories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade crochet flowers, bouquets, plushies, gifts, and home décor. Filter by category, colour, and price.",
};

// Re-check the database at most once a minute.
export const revalidate = 60;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  return (
    <>
      <PageHeader
        eyebrow="The Collection"
        title="Shop handmade crochet"
        description="Every piece is crocheted by hand and made to order. Filter to find your next treasure."
        crumbs={[{ label: "Shop" }]}
      />
      <Suspense fallback={<div className="py-24 text-center text-muted">Loading…</div>}>
        <ShopClient products={products} categories={categories} />
      </Suspense>
    </>
  );
}
