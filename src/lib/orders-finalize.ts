import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewOrder } from "@/lib/email";
import { fulfillOrderPatterns } from "@/lib/patterns-fulfill";

interface OrderItem {
  name: string;
  quantity: number;
  kind?: string;
  pattern_id?: string;
  productId?: string;
}

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  name: string | null;
  email: string | null;
  total: number | string;
  digital_only?: boolean;
  items: OrderItem[] | null;
}

export interface FinalizeResult {
  orderNumber: string;
  digitalOnly: boolean;
  email: string | null;
}

/**
 * Runs everything that happens once an order is paid:
 *  - emails the PDF for any pattern items (always),
 *  - sends the order confirmation ONLY when the order has physical items
 *    (a pattern-only order gets just the pattern email, no confirmation).
 */
export async function fulfillOrderRow(order: OrderRow): Promise<void> {
  const items = order.items ?? [];
  const patternItems = items.filter((i) => i.kind === "pattern");

  if (patternItems.length) {
    await fulfillOrderPatterns({
      ref: order.id,
      email: order.email,
      items: patternItems,
    });
  }

  if (!order.digital_only) {
    await notifyNewOrder({
      orderNumber: order.order_number,
      name: order.name ?? "",
      email: order.email ?? "",
      total: Number(order.total),
      items: items.map((i) => ({ name: i.name, quantity: i.quantity })),
    });
  }
}

/**
 * Marks a pending order as paid ("Order Received") and fulfils it —
 * exactly once. Safe to call multiple times (webhook + success page):
 * only the first call (while still pending) delivers anything.
 */
export async function finalizeOrderById(
  orderId: string | undefined | null,
): Promise<FinalizeResult | null> {
  if (!orderId) return null;
  const admin = createAdminClient();

  const { data } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!data) return null;
  const order = data as OrderRow;

  if (order.status === "Pending payment") {
    await admin
      .from("orders")
      .update({ status: "Order Received" })
      .eq("id", orderId);
    await fulfillOrderRow(order);
  }

  return {
    orderNumber: order.order_number,
    digitalOnly: Boolean(order.digital_only),
    email: order.email,
  };
}

/** Deletes an order only if it's still awaiting payment (abandoned checkout). */
export async function cancelPendingOrder(
  orderId: string | undefined | null,
): Promise<void> {
  if (!orderId) return;
  const admin = createAdminClient();
  await admin
    .from("orders")
    .delete()
    .eq("id", orderId)
    .eq("status", "Pending payment");
}
