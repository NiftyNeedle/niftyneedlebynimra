"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, FileText, Lock, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { ButtonLink } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useCurrency } from "@/components/currency/currency-provider";
import { startCheckout, type CheckoutState } from "@/app/checkout/actions";

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

export function CheckoutView({ stripeEnabled }: { stripeEnabled: boolean }) {
  const { cart, cartSubtotal, coupon } = useStore();
  const toast = useToast();
  const { format, currency } = useCurrency();
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    startCheckout,
    {},
  );

  const hasPhysical = cart.some((i) => i.kind !== "pattern");
  const hasPattern = cart.some((i) => i.kind === "pattern");
  const shipping = hasPhysical ? (shippingMethod === "express" ? 16 : 6) : 0;
  const discountAmount =
    Math.round(cartSubtotal * (coupon?.rate ?? 0) * 100) / 100;
  const taxable = cartSubtotal - discountAmount;
  const tax = Math.round(taxable * 0.05 * 100) / 100;
  const total = taxable + shipping + tax;

  useEffect(() => {
    if (state.error) toast(state.error, "info");
  }, [state, toast]);

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

      <form action={formAction} className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <input type="hidden" name="items" value={JSON.stringify(cart)} />
        <input type="hidden" name="coupon" value={coupon?.code ?? ""} />

        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-serif text-2xl text-foreground">Contact</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="firstName" required placeholder="First name" className={field} />
              <input name="lastName" required placeholder="Last name" className={field} />
              <input
                name="email"
                required
                type="email"
                placeholder="Email"
                className={`${field} sm:col-span-2`}
              />
              <input name="phone" placeholder="Phone" className={`${field} sm:col-span-2`} />
            </div>
            {hasPattern && (
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/30 bg-surface-muted/50 p-4 text-sm">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-foreground">
                  Your order includes a digital pattern. The PDF will be{" "}
                  <strong>emailed to the address above</strong> right after
                  payment — please double-check it&apos;s spelled correctly.
                </p>
              </div>
            )}
          </section>

          {hasPhysical && (
          <>
          <section>
            <h2 className="mb-4 font-serif text-2xl text-foreground">
              Shipping address
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="address"
                required
                placeholder="Address"
                className={`${field} sm:col-span-2`}
              />
              <input name="city" required placeholder="City" className={field} />
              <input name="postal_code" required placeholder="Postal code" className={field} />
              <input name="country" required placeholder="Country" className={field} />
              <input name="state" placeholder="State / Province" className={field} />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-2xl text-foreground">
              Shipping method
            </h2>
            <div className="space-y-3">
              {[
                { id: "standard", label: "Standard", eta: "7–12 days", cost: 6 },
                { id: "express", label: "Express", eta: "3–5 days", cost: 16 },
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
                      value={m.id}
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
                  <span className="font-medium">{format(m.cost)}</span>
                </label>
              ))}
            </div>
          </section>
          </>
          )}

          <section>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl text-foreground">
              Payment
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-normal text-muted">
                <Lock className="h-3 w-3" /> Secure
              </span>
            </h2>
            <div className="rounded-2xl border border-border p-5 text-sm text-muted">
              {stripeEnabled ? (
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  You&apos;ll be taken to Stripe&apos;s secure page to pay by card,
                  Apple Pay, or Google Pay.
                </p>
              ) : (
                <p>
                  Online card payment isn&apos;t enabled yet — your order is placed
                  and saved, and payment is arranged directly.
                </p>
              )}
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
                    className="relative h-14 w-14 shrink-0 rounded-xl bg-cover bg-center"
                    style={
                      item.swatch.startsWith("http")
                        ? { backgroundImage: `url(${item.swatch})` }
                        : { background: item.swatch }
                    }
                  >
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[0.6rem] font-semibold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="flex-1 text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-medium">
                    {format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="font-medium">{format(cartSubtotal)}</dd>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sage-deep">
                  <dt>Discount{coupon ? ` (${coupon.code})` : ""}</dt>
                  <dd>−{format(discountAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="font-medium">
                  {hasPhysical ? format(shipping) : "Digital — none"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Tax</dt>
                <dd className="font-medium">{format(tax)}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
              <span className="font-serif text-xl text-foreground">Total</span>
              <span className="font-serif text-2xl font-semibold text-foreground">
                {format(total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
            >
              <Lock className="h-4 w-4" />
              {pending
                ? "Processing…"
                : stripeEnabled
                  ? `Continue to payment · ${format(total)}`
                  : `Place order · ${format(total)}`}
            </button>
            {currency !== "EUR" && (
              <p className="mt-3 text-center text-xs text-muted">
                Prices are shown in {currency}; payment is processed in EUR.
              </p>
            )}
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure &amp; saved. You can also{" "}
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
