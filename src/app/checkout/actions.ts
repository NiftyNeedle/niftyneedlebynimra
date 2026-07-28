"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, siteUrl } from "@/lib/stripe";
import { fulfillOrderRow } from "@/lib/orders-finalize";

export interface CheckoutState {
  error?: string;
}

interface CartLine {
  quantity?: number;
  slug?: string;
  swatch?: string;
  options?: Record<string, string>;
  kind?: string;
  productId?: string;
}

interface CleanItem {
  name: string;
  quantity: number;
  price: number;
  slug: string | null;
  swatch: string | null;
  options: Record<string, string> | null;
  kind: "pattern" | null;
  pattern_id: string | null;
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

  const admin = createAdminClient();

  // ── Re-price EVERYTHING from the database. Client-supplied prices are
  //    never trusted — this is what stops cart tampering. ──────────────
  const productSlugs = Array.from(
    new Set(
      items
        .filter((i) => i.kind !== "pattern" && i.slug)
        .map((i) => i.slug as string),
    ),
  );
  const patternIds = Array.from(
    new Set(
      items
        .filter((i) => i.kind === "pattern" && i.productId)
        .map((i) => i.productId as string),
    ),
  );

  const products = new Map<
    string,
    { name: string; price: number; sale_price: number | null; in_stock: boolean; archived: boolean; swatch: string | null; image_url: string | null }
  >();
  if (productSlugs.length) {
    const { data } = await admin
      .from("products")
      .select("slug,name,price,sale_price,in_stock,archived,swatch,image_url")
      .in("slug", productSlugs);
    for (const p of data ?? []) products.set((p as { slug: string }).slug, p as never);
  }

  const patterns = new Map<
    string,
    { title: string; price: number; is_free: boolean; published: boolean }
  >();
  if (patternIds.length) {
    const { data } = await admin
      .from("patterns")
      .select("id,title,price,is_free,published")
      .in("id", patternIds);
    for (const p of data ?? []) patterns.set((p as { id: string }).id, p as never);
  }

  const cleanItems: CleanItem[] = [];
  for (const i of items) {
    if (i.kind === "pattern") {
      const p = patterns.get(String(i.productId));
      if (!p || !p.published) {
        return {
          error:
            "A pattern in your cart is no longer available. Please review your cart.",
        };
      }
      if (p.is_free) {
        return {
          error:
            "A free pattern can't be purchased — request it by email from its page instead.",
        };
      }
      cleanItems.push({
        name: p.title,
        quantity: 1,
        price: Number(p.price) || 0,
        slug: i.slug ?? null,
        swatch: i.swatch ?? null,
        options: null,
        kind: "pattern",
        pattern_id: String(i.productId),
      });
    } else {
      const p = products.get(String(i.slug));
      if (!p || p.archived) {
        return {
          error:
            "An item in your cart is no longer available. Please review your cart.",
        };
      }
      if (!p.in_stock) {
        return {
          error: `"${p.name}" is out of stock — please remove it to continue.`,
        };
      }
      const qty = Math.max(1, Math.floor(Number(i.quantity) || 1));
      const price =
        p.sale_price != null ? Number(p.sale_price) : Number(p.price) || 0;
      cleanItems.push({
        name: p.name,
        quantity: qty,
        price,
        slug: i.slug ?? null,
        swatch: i.swatch ?? null,
        options: i.options ?? null,
        kind: null,
        pattern_id: null,
      });
    }
  }
  if (!cleanItems.length) return { error: "Your cart is empty." };

  const hasPhysical = cleanItems.some((i) => i.kind !== "pattern");
  const digitalOnly = !hasPhysical;

  // Money — computed entirely from DB-authoritative prices.
  const subtotal =
    Math.round(
      cleanItems.reduce((n, i) => n + i.price * i.quantity, 0) * 100,
    ) / 100;
  const method = String(formData.get("shipping") ?? "standard");
  const shipping = hasPhysical ? (method === "express" ? 16 : 6) : 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

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
