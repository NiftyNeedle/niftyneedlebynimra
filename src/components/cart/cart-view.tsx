"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, Tag, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCurrency } from "@/components/currency/currency-provider";

const COUPONS: Record<string, number> = { WELCOME10: 0.1, LOVE15: 0.15 };
const SHIP_COST = 6;

export function CartView() {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useStore();
  const toast = useToast();
  const { format } = useCurrency();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const shipping = cartSubtotal === 0 ? 0 : SHIP_COST;
  const discountAmount = cartSubtotal * discount;
  const tax = (cartSubtotal - discountAmount) * 0.05;
  const total = cartSubtotal - discountAmount + shipping + tax;

  const applyCoupon = () => {
    const rate = COUPONS[code.toUpperCase()];
    if (rate) {
      setDiscount(rate);
      toast(`Coupon applied — ${rate * 100}% off!`);
    } else {
      toast("That coupon code isn't valid", "info");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="section-px mx-auto flex max-w-[90rem] flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="text-6xl">🧶</span>
        <h1 className="font-serif text-4xl font-semibold text-foreground">
          Your cart is empty
        </h1>
        <p className="max-w-md text-muted">
          Once you add a handmade treasure, it&apos;ll appear here.
        </p>
        <ButtonLink href="/shop" size="lg" className="mt-2">
          Browse the shop
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="section-px mx-auto max-w-[90rem] py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold text-foreground md:text-5xl">
        Your Cart
      </h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        {/* Items */}
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-5 rounded-3xl border border-border bg-surface p-4 shadow-[var(--shadow-soft)]"
            >
              <Link
                href={`/product/${item.slug}`}
                className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl"
                style={{ background: item.swatch }}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-serif text-xl text-foreground hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.options && (
                      <p className="mt-1 text-sm text-muted">
                        {Object.entries(item.options)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <button
                    aria-label="Remove item"
                    onClick={() => removeFromCart(item.id)}
                    className="text-muted transition-colors hover:text-accent"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 rounded-full border border-border p-1">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-serif text-xl font-semibold text-foreground">
                    {format(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/shop"
            className="inline-block text-sm font-medium text-accent hover:underline"
          >
            ← Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-2xl text-foreground">
              Order Summary
            </h2>

            <div className="mt-5 flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full rounded-full border border-border bg-surface-muted/50 py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={applyCoupon}
                className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Apply
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Try <span className="font-medium">WELCOME10</span> or{" "}
              <span className="font-medium">LOVE15</span>
            </p>

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium">{format(cartSubtotal)}</dd>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sage-deep">
                  <dt>Discount</dt>
                  <dd>−{format(discountAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium">
                  {shipping === 0 ? "Free" : format(shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Estimated tax</dt>
                <dd className="font-medium">{format(tax)}</dd>
              </div>
            </dl>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
              <span className="font-serif text-xl text-foreground">Total</span>
              <span className="font-serif text-2xl font-semibold text-foreground">
                {format(total)}
              </span>
            </div>

            <ButtonLink href="/checkout" size="lg" className="mt-6 w-full">
              Proceed to Checkout
            </ButtonLink>
            <p className="mt-3 text-center text-xs text-muted">
              Estimated delivery in 7–12 days · Secure Stripe checkout
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
