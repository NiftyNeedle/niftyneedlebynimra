"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const FREE_SHIP_THRESHOLD = 75;

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    cartCount,
  } = useStore();

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - cartSubtotal);
  const progress = Math.min(100, (cartSubtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[60] bg-espresso/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-surface shadow-[var(--shadow-lift)]"
          >
            <header className="flex items-center justify-between border-b border-border p-6">
              <h2 className="flex items-center gap-2 font-serif text-2xl text-foreground">
                <ShoppingBag className="h-5 w-5" />
                Your Cart
                {cartCount > 0 && (
                  <span className="text-base text-muted">({cartCount})</span>
                )}
              </h2>
              <button
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted"
              >
                <X className="h-6 w-6" />
              </button>
            </header>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-surface-muted text-4xl">
                  🧶
                </span>
                <p className="font-serif text-xl text-foreground">
                  Your cart is empty
                </p>
                <p className="text-sm text-muted">
                  Let&apos;s find something handmade to love.
                </p>
                <ButtonLink href="/shop" onClick={() => setCartOpen(false)}>
                  Browse the shop
                </ButtonLink>
              </div>
            ) : (
              <>
                {/* Free-shipping progress */}
                <div className="border-b border-border px-6 py-4">
                  <p className="text-sm text-muted">
                    {remaining > 0 ? (
                      <>
                        You&apos;re{" "}
                        <span className="font-semibold text-foreground">
                          {formatPrice(remaining)}
                        </span>{" "}
                        away from free shipping!
                      </>
                    ) : (
                      <span className="font-medium text-sage-deep">
                        🎉 You&apos;ve unlocked free shipping!
                      </span>
                    )}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-sage-deep transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <Link
                        href={`/product/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl"
                        style={{ background: item.swatch }}
                      />
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="font-serif text-base text-foreground hover:underline"
                          >
                            {item.name}
                          </Link>
                          <button
                            aria-label="Remove item"
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted transition-colors hover:text-accent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        {item.options && (
                          <p className="mt-0.5 text-xs text-muted">
                            {Object.entries(item.options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 rounded-full border border-border">
                            <button
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-surface-muted"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-5 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="grid h-7 w-7 place-items-center rounded-full hover:bg-surface-muted"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <span className="font-semibold text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="border-t border-border p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-serif text-2xl font-semibold text-foreground">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                  <p className="mb-4 text-xs text-muted">
                    Shipping &amp; taxes calculated at checkout.
                  </p>
                  <ButtonLink
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="w-full"
                    size="lg"
                  >
                    Checkout
                  </ButtonLink>
                  <ButtonLink
                    href="/cart"
                    onClick={() => setCartOpen(false)}
                    variant="ghost"
                    className="mt-2 w-full"
                  >
                    View full cart
                  </ButtonLink>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
