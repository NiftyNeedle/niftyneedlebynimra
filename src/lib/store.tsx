"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./types";
import { unitPriceFor } from "./pricing";

export interface AppliedCoupon {
  code: string;
  rate: number;
}

/* ------------------------------------------------------------------ *
 *  Client-side cart + wishlist store (localStorage persistence).
 *  Swap persistence for Supabase later without changing consumers.
 * ------------------------------------------------------------------ */

export interface CartItem {
  id: string; // unique per configuration
  productId: string;
  slug: string;
  name: string;
  price: number;
  swatch: string;
  quantity: number;
  options?: Record<string, string>;
  kind?: "pattern"; // absent = physical product
}

/** Minimal shape needed to add a digital pattern to the cart. */
export interface CartablePattern {
  id: string;
  slug: string;
  title: string;
  price: number;
  imageUrl?: string;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    opts?: { quantity?: number; options?: Record<string, string> },
  ) => void;
  addPatternToCart: (pattern: CartablePattern) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  coupon: AppliedCoupon | null;
  setCoupon: (coupon: AppliedCoupon | null) => void;
}

const StoreContext = createContext<StoreState | null>(null);

function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state, hydrated]);

  return [state, setState] as const;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistentState<CartItem[]>("nn_cart", []);
  const [wishlist, setWishlist] = usePersistentState<string[]>(
    "nn_wishlist",
    [],
  );
  const [coupon, setCoupon] = usePersistentState<AppliedCoupon | null>(
    "nn_coupon",
    null,
  );
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart: StoreState["addToCart"] = useCallback(
    (product, opts) => {
      const quantity = opts?.quantity ?? 1;
      const options = opts?.options;
      const configId =
        product.id +
        (options ? ":" + Object.values(options).join("-") : "");
      setCart((prev) => {
        const existing = prev.find((i) => i.id === configId);
        if (existing) {
          return prev.map((i) =>
            i.id === configId
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [
          ...prev,
          {
            id: configId,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: unitPriceFor(product, options),
            swatch: product.swatch,
            quantity,
            options,
          },
        ];
      });
      setCartOpen(true);
    },
    [setCart],
  );

  const addPatternToCart: StoreState["addPatternToCart"] = useCallback(
    (pattern) => {
      const configId = "pattern:" + pattern.id;
      setCart((prev) => {
        // A digital pattern is bought once — never increment quantity.
        if (prev.some((i) => i.id === configId)) return prev;
        return [
          ...prev,
          {
            id: configId,
            productId: pattern.id,
            slug: pattern.slug,
            name: pattern.title,
            price: pattern.price,
            swatch:
              pattern.imageUrl ||
              "linear-gradient(135deg,#dde4ee,#8fa57e)",
            quantity: 1,
            kind: "pattern",
          },
        ];
      });
      setCartOpen(true);
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (id: string) => setCart((prev) => prev.filter((i) => i.id !== id)),
    [setCart],
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) =>
      setCart((prev) =>
        prev
          .map((i) => (i.id === id ? { ...i, quantity } : i))
          .filter((i) => i.quantity > 0),
      ),
    [setCart],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, [setCart, setCoupon]);

  const toggleWishlist = useCallback(
    (productId: string) =>
      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      ),
    [setWishlist],
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const cartCount = useMemo(
    () => cart.reduce((n, i) => n + i.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((n, i) => n + i.price * i.quantity, 0),
    [cart],
  );

  const value: StoreState = {
    cart,
    wishlist,
    cartOpen,
    setCartOpen,
    addToCart,
    addPatternToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isWishlisted,
    cartCount,
    cartSubtotal,
    coupon,
    setCoupon,
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
