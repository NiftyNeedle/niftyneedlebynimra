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
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
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
            price: product.salePrice ?? product.price,
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

  const clearCart = useCallback(() => setCart([]), [setCart]);

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
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isWishlisted,
    cartCount,
    cartSubtotal,
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
