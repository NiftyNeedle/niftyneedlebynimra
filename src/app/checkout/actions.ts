"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, siteUrl } from "@/lib/stripe";
import { fulfillOrderRow } from "@/lib/orders-finalize";

export interface CheckoutState {
  error?: string;
}

interface CartLine {
  name: string;
  quantity: number;
  price: number;
  slug?: string;
  swatch?: string;
  options?: Record<string, string>;
  kind?: string;
  productId?: string;
}

function str(v: FormDataEntryValue | null) {
  const s = String(v ?? "").trim();
  return s || null;
}

export async function startCheckout(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
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

  const hasPhysical = items.some((i) => i.kind !== "pattern");
  const digitalOnly = !hasPhysical;

  // Recompute money on the server — never trust client totals.
  const subtotal = items.reduce(
    (n, i) => n + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0,
  );
  const method = String(formData.get("shipping") ?? "standard");
  // Digital patterns never ship → no shipping charge for pattern-only orders.
  const shipping = hasPhysical ? (method === "express" ? 16 : 6) : 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const cleanItems = items.map((i) => ({
    name: String(i.name ?? ""),
    quantity: Number(i.quantity) || 1,
    price: Number(i.price) || 0,
    slug: i.slug ?? null,
    swatch: i.swatch ?? null,
    options: i.options ?? null,
    kind: i.kind === "pattern" ? "pattern" : null,
    pattern_id: i.kind === "pattern" ? i.productId ?? null : null,
  }));

  const customer = {
    name,
    email,
    phone: str(formData.get("phone")),
    address: str(formData.get("address")),
    city: str(formData.get("city")),
    postal_code: str(formData.get("postal_code")),
    country: str(formData.get("country")),
    state: str(formData.get("state")),
    shipping_method: hasPhysical ? method : "digital",
    items: cleanItems,
    subtotal,
    shipping,
    tax,
    total,
    currency: "USD",
    digital_only: digitalOnly,
  };

  const admin = createAdminClient();
  const stripe = getStripe();

  // No Stripe configured → place the order directly (no online payment).
  if (!stripe) {
    const { data, error } = await admin
      .from("orders")
      .insert({ status: "Order Received", ...customer })
      .select("*")
      .single();
    if (error) return { error: error.message };

    await fulfillOrderRow(data);
    redirect(`/checkout/success?order=${data.order_number}`);
  }

  // Stripe path → create a pending order, then a Checkout Session.
  const { data, error } = await admin
    .from("orders")
    .insert({ status: "Pending payment", ...customer })
    .select("id, order_number")
    .single();
  if (error) return { error: error.message };

  const line_items = cleanItems.map((i) => ({
    quantity: i.quantity,
    price_data: {
      currency: "usd",
      unit_amount: Math.round(i.price * 100),
      product_data: {
        name:
          i.name +
          (i.kind === "pattern" ? " (PDF pattern)" : "") +
          (i.options ? ` (${Object.values(i.options).join(", ")})` : ""),
      },
    },
  }));
  if (shipping > 0)
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(shipping * 100),
        product_data: { name: "Shipping" },
      },
    });
  if (tax > 0)
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(tax * 100),
        product_data: { name: "Tax (5%)" },
      },
    });

  let url: string | null = null;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: email,
      // 30 minutes is the shortest Stripe allows before the session expires.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      success_url: `${siteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/cart`,
      metadata: {
        order_id: data.id as string,
        order_number: data.order_number as string,
      },
    });
    url = session.url;
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Could not start payment.",
    };
  }

  if (!url) return { error: "Could not start payment. Please try again." };
  redirect(url);
}
