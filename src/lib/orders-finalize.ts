import { createAdminClient } from "@/lib/supabase/admin";
import { notifyNewOrder } from "@/lib/email";

/**
 * Marks a pending order as paid ("Order Received") and sends the
 * confirmation email — exactly once. Safe to call multiple times
 * (webhook + success page): only the first call (while still pending)
 * does anything.
 */
export async function finalizeOrderById(
  orderId: string | undefined | null,
): Promise<string | null> {
  if (!orderId) return null;
  const admin = createAdminClient();

  const { data } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();
  if (!data) return null;

  if (data.status === "Pending payment") {
    await admin
      .from("orders")
      .update({ status: "Order Received" })
      .eq("id", orderId);

    await notifyNewOrder({
      orderNumber: data.order_number,
      name: data.name ?? "",
      email: data.email ?? "",
      total: Number(data.total),
      items: (data.items ?? []).map((i: { name: string; quantity: number }) => ({
        name: i.name,
        quantity: i.quantity,
      })),
    });
  }

  return data.order_number as string;
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
