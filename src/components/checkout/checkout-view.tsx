"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CreditCard, Check, Lock, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const FREE_SHIP = 75;

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function CheckoutView() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const [placed, setPlaced] = useState(false);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const shipping =
    cartSubtotal >= FREE_SHIP ? 0 : shippingMethod === "express" ? 16 : 6;
  const tax = cartSubtotal * 0.05;
  const total = cartSubtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlaced(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <div className="section-px mx-auto flex max-w-2xl flex-col items-center justify-center gap-5 py-32 text-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-sage-deep text-white"
        >
          <Check className="h-12 w-12" />
        </motion.span>
        <h1 className="font-serif text-4xl font-semibold text-foreground">
          Thank you for your order!
        </h1>
        <p className="max-w-md text-muted">
          A confirmation email is on its way. We&apos;ll begin handcrafting your
          order right away and keep you posted at every step.
        </p>
        <p className="rounded-full bg-surface-muted px-5 py-2 text-sm">
          Order <span className="font-semibold">#NN-{Math.floor(1000 + total)}</span>
        </p>
        <div className="mt-4 flex gap-3">
          <ButtonLink href="/account/orders">Track your order</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Continue shopping
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="section-px mx-auto flex max-w-[90rem] flex-col items-center justify-center gap-4 py-32 text-center">
        <span className="text-6xl">🛒</span>
        <h1 className="font-serif text-4xl font-semibold text-foreground">
          Nothing to check out yet
        </h1>
        <ButtonLink href="/shop" size="lg">
          Browse the shop
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="section-px mx-auto max-w-[90rem] py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold text-foreground md:text-5xl">
        Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_22rem]"
      >
        <div className="space-y-10">
          {/* Contact */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-foreground">
              Contact
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder="First name" className={field} />
              <input required placeholder="Last name" className={field} />
              <input
                required
                type="email"
                placeholder="Email"
                className={`${field} sm:col-span-2`}
              />
              <input placeholder="Phone" className={`${field} sm:col-span-2`} />
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-muted">
              <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" />
              Email me with news and exclusive offers
            </label>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-foreground">
              Shipping address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Address"
                className={`${field} sm:col-span-2`}
              />
              <input placeholder="Apartment, suite (optional)" className={`${field} sm:col-span-2`} />
              <input required placeholder="City" className={field} />
              <input required placeholder="Postal code" className={field} />
              <input required placeholder="Country" className={field} />
              <input required placeholder="State / Province" className={field} />
            </div>
          </section>

          {/* Shipping method */}
          <section>
            <h2 className="mb-4 font-serif text-2xl text-foreground">
              Shipping method
            </h2>
            <div className="space-y-3">
              {[
                { id: "standard", label: "Standard", eta: "7–12 days", cost: cartSubtotal >= FREE_SHIP ? 0 : 6 },
                { id: "express", label: "Express", eta: "3–5 days", cost: cartSubtotal >= FREE_SHIP ? 0 : 16 },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors ${
                    shippingMethod === m.id
                      ? "border-primary bg-surface-muted/50"
                      : "border-border"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === m.id}
                      onChange={() => setShippingMethod(m.id)}
                      className="h-4 w-4 accent-[var(--color-primary)]"
                    />
                    <span>
                      <span className="block font-medium text-foreground">
                        {m.label}
                      </span>
                      <span className="text-sm text-muted">{m.eta}</span>
                    </span>
                  </span>
                  <span className="font-medium">
                    {m.cost === 0 ? "Free" : formatPrice(m.cost)}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-foreground">
              Payment
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-normal text-muted">
                <Lock className="h-3 w-3" /> Secure
              </span>
            </h2>
            <div className="rounded-2xl border border-border p-5">
              <div className="mb-4 flex items-center gap-2 text-sm text-muted">
                <CreditCard className="h-4 w-4" />
                Card · Apple Pay · Google Pay (via Stripe)
              </div>
              <div className="grid gap-4">
                <input placeholder="Card number" className={field} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="MM / YY" className={field} />
                  <input placeholder="CVC" className={field} />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted">
                Demo only — no real payment is processed. Stripe keys wire in here.
              </p>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-2xl text-foreground">Your order</h2>
            <div className="mt-5 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className="relative h-14 w-14 shrink-0 rounded-xl"
                    style={{ background: item.swatch }}
                  >
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[0.6rem] font-semibold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="flex-1 text-sm text-foreground">
                    {item.name}
                  </span>
                  <span className="text-sm font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium">{formatPrice(cartSubtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Tax</dt>
                <dd className="font-medium">{formatPrice(tax)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
              <span className="font-serif text-xl text-foreground">Total</span>
              <span className="font-serif text-2xl font-semibold text-foreground">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <Lock className="h-4 w-4" />
              Pay {formatPrice(total)}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5" />
              Encrypted &amp; secure. You can also{" "}
              <Link href="/cart" className="underline">
                edit your cart
              </Link>
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
