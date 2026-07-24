"use client";

import { useStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/home/product-card";
import { ButtonLink } from "@/components/ui/button";

export function WishlistGrid({ products }: { products: Product[] }) {
  const { wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border py-20 text-center">
        <span className="text-5xl">🤍</span>
        <p className="font-serif text-2xl text-foreground">
          Your wishlist is empty
        </p>
        <p className="max-w-sm text-muted">
          Tap the heart on any product to save it here for later.
        </p>
        <ButtonLink href="/shop">Browse the shop</ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
