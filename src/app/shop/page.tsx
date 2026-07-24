import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ShopClient } from "@/components/shop/shop-client";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse handmade crochet flowers, bouquets, plushies, gifts, and home décor. Filter by category, colour, and price.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Collection"
        title="Shop handmade crochet"
        description="Every piece is crocheted by hand and made to order. Filter to find your next treasure."
        crumbs={[{ label: "Shop" }]}
      />
      <Suspense fallback={<div className="py-24 text-center text-muted">Loading…</div>}>
        <ShopClient />
      </Suspense>
    </>
  );
}
