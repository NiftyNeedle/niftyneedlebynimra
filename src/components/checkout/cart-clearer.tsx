"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

/** Clears the cart once, after a successful order. */
export function CartClearer() {
  const { clearCart } = useStore();
  useEffect(() => {
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
