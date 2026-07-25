"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { useCurrency } from "@/components/currency/currency-provider";

export function ProductCard({ product }: { product: Product }) {
  const hasSale = typeof product.salePrice === "number";
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const toast = useToast();
  const { format } = useCurrency();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]"
    >
      <div className="relative aspect-square overflow-hidden">
        <Link
          href={`/product/${product.slug}`}
          aria-label={product.name}
          className="absolute inset-0 block"
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              style={{ background: product.swatch }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-sage-deep px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
              New
            </span>
          )}
          {hasSale && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-white">
              Sale
            </span>
          )}
          {product.customizable && (
            <span className="glass rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-foreground">
              Customizable
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-500 group-hover:opacity-100">
          <button
            aria-label="Add to wishlist"
            onClick={() => {
              toggleWishlist(product.id);
              toast(
                wishlisted ? "Removed from wishlist" : "Added to wishlist",
                "info",
              );
            }}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent hover:text-white",
              wishlisted && "bg-accent text-white",
            )}
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
          </button>
          <Link
            href={`/product/${product.slug}`}
            aria-label="Quick view"
            className="grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex items-center gap-1 text-xs text-muted">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          <span className="font-medium text-foreground">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </div>

        <h3 className="font-serif text-lg leading-snug text-foreground">
          <Link href={`/product/${product.slug}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              {format(hasSale ? product.salePrice! : product.price, product.currency)}
            </span>
            {hasSale && (
              <span className="text-sm text-muted line-through">
                {format(product.price, product.currency)}
              </span>
            )}
          </div>
          <button
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addToCart(product);
              toast(`${product.name} added to cart`);
            }}
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
