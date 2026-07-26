"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import { categories } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CurrencySwitcher } from "@/components/currency/currency-switcher";
import { ButtonLink } from "@/components/ui/button";

const primaryLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Custom Orders", href: "/custom" },
  { label: "Track Order", href: "/track" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const { cartCount, wishlist, setCartOpen } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "glass shadow-[var(--shadow-soft)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      {/* Announcement strip */}
      <div className="bg-brown-deep text-warm-white text-center text-xs tracking-wide py-2 px-4">
        Handcrafted to order with love.
      </div>

      <nav className="section-px mx-auto flex h-18 max-w-[90rem] items-center justify-between py-3">
        <Logo />

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <Link
              href="/shop"
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Collections
            </Link>
            <AnimatePresence>
              {shopOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-4"
                >
                  <div className="glass grid grid-cols-2 gap-1 rounded-2xl p-3 shadow-[var(--shadow-lift)]">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/shop?category=${c.slug}`}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-muted"
                      >
                        <span className="text-xl">{c.icon}</span>
                        <span className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {c.name}
                          </span>
                          <span className="text-xs text-muted">
                            {c.description}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {primaryLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <CurrencySwitcher className="hidden sm:inline-flex" />
          <ThemeToggle className="hidden sm:grid" />
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-muted sm:grid"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-muted"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <ButtonLink href="/shop" size="sm" className="ml-1 hidden lg:inline-flex">
            Shop Now
          </ButtonLink>

          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-foreground transition-colors hover:bg-surface-muted lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-espresso/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-surface p-6 shadow-[var(--shadow-lift)] lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <Logo />
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <Link
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-lg font-medium hover:bg-surface-muted"
                >
                  Collections
                </Link>
                {primaryLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-lg font-medium hover:bg-surface-muted"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                <div className="flex gap-2">
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileOpen(false)}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>
                  <ThemeToggle />
                  <CurrencySwitcher />
                </div>
                <ButtonLink
                  href="/shop"
                  onClick={() => setMobileOpen(false)}
                  size="sm"
                >
                  Shop Now
                </ButtonLink>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
