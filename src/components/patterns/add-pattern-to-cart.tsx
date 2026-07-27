"use client";

import { ShoppingBag } from "lucide-react";
import { useStore, type CartablePattern } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { useCurrency } from "@/components/currency/currency-provider";

export function AddPatternToCart({ pattern }: { pattern: CartablePattern }) {
  const { cart, addPatternToCart } = useStore();
  const toast = useToast();
  const { format } = useCurrency();
  const inCart = cart.some((i) => i.id === "pattern:" + pattern.id);

  return (
    <div>
      <button
        onClick={() => {
          if (inCart) {
            toast("This pattern is already in your cart", "info");
            return;
          }
          addPatternToCart(pattern);
          toast(`${pattern.title} added to cart`);
        }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] sm:w-auto"
      >
        <ShoppingBag className="h-4 w-4" />
        {inCart ? "In your cart" : `Add to cart — ${format(pattern.price, "USD")}`}
      </button>
      <p className="mt-2 text-xs text-muted">
        Digital PDF — no shipping. It&apos;s emailed to you right after
        checkout, so double-check your email address.
      </p>
    </div>
  );
}
