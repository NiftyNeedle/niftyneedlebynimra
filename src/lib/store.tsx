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
import { createClient, isSupabaseConfigured } from "./supabase/client";

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

  // Supabase auth → per-account wishlist persistence.
  const supabase = useMemo(
    () => (isSupabaseConfigured ? createClient() : null),
    [],
  );
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // On login, merge the local wishlist with the account's saved wishlist.
  useEffect(() => {
    if (!supabase || !userId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId);
      if (cancelled) return;
      const dbIds = (data ?? []).map((r) => r.product_id as string);
      setWishlist((local) => {
        const toAdd = local.filter((id) => !dbIds.includes(id));
        if (toAdd.length) {
          void supabase
            .from("wishlists")
            .upsert(toAdd.map((product_id) => ({ user_id: userId, product_id })));
        }
        return Array.from(new Set([...local, ...dbIds]));
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, userId, setWishlist]);

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
      setWishlist((prev) => {
        const has = prev.includes(productId);
        if (supabase && userId) {
          if (has) {
            void supabase
              .from("wishlists")
              .delete()
              .eq("user_id", userId)
              .eq("product_id", productId);
          } else {
            void supabase
              .from("wishlists")
              .insert({ user_id: userId, product_id: productId });
          }
        }
        return has
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
      }),
    [setWishlist, supabase, userId],
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
