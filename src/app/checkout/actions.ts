"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewOrder } from "@/lib/email";

export interface PlaceOrderState {
  ok?: boolean;
  error?: string;
  orderNumber?: string;
}

const FREE_SHIP = 75;

interface CartLine {
  name: string;
  quantity: number;
  price: number;
  slug?: string;
  swatch?: string;
  options?: Record<string, string>;
}

function str(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s || null;
}

export async function placeOrder(
  _prev: PlaceOrderState,
  formData: FormData,
): Promise<PlaceOrderState> {
  try {
    let items: CartLine[] = [];
    try {
      const parsed = JSON.parse(String(formData.get("items") ?? "[]"));
      if (Array.isArray(parsed)) items = parsed;
    } catch {
      items = [];
    }
    if (!items.length) return { error: "Your cart is empty." };

    const name = `${String(formData.get("firstName") ?? "").trim()} ${String(
      formData.get("lastName") ?? "",
    ).trim()}`.trim();
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return { error: "An email address is required." };

    // Recompute money on the server — never trust client totals.
    const subtotal = items.reduce(
      (n, i) => n + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0,
    );
    const method = String(formData.get("shipping") ?? "standard");
    const shipping =
      subtotal >= FREE_SHIP ? 0 : method === "express" ? 16 : 6;
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + shipping + tax) * 100) / 100;

    const cleanItems = items.map((i) => ({
      name: String(i.name ?? ""),
      quantity: Number(i.quantity) || 1,
      price: Number(i.price) || 0,
      slug: i.slug ?? null,
      swatch: i.swatch ?? null,
      options: i.options ?? null,
    }));

    const admin = createAdminClient();
    const { data, error } = await admin
      .from("orders")
      .insert({
        status: "Order Received",
        name,
        email,
        phone: str(formData.get("phone")),
        address: str(formData.get("address")),
        city: str(formData.get("city")),
        postal_code: str(formData.get("postal_code")),
        country: str(formData.get("country")),
        state: str(formData.get("state")),
        shipping_method: method,
        items: cleanItems,
        subtotal,
        shipping,
        tax,
        total,
        currency: "USD",
      })
      .select("order_number")
      .single();

    if (error) return { error: error.message };

    const orderNumber = data.order_number as string;
    await notifyNewOrder({
      orderNumber,
      name,
      email,
      total,
      items: cleanItems.map((i) => ({ name: i.name, quantity: i.quantity })),
    });

    return { ok: true, orderNumber };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Checkout failed. Please try again.",
    };
  }
}
