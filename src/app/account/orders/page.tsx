import Link from "next/link";
import { Truck } from "lucide-react";
import { getMyOrders } from "@/lib/account";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/orders";
import { OrderTimeline, StatusBadge } from "@/components/account/order-timeline";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getMyOrders();

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-serif text-2xl text-foreground">Your orders</h2>
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <span className="text-5xl">📦</span>
          <p className="mt-3 font-serif text-2xl text-foreground">No orders yet</p>
          <p className="mt-1 text-muted">
            When you place an order, it&apos;ll appear here with live tracking.
          </p>
          <ButtonLink href="/shop" className="mt-5">
            Browse the shop
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-foreground">Your orders</h2>
      {orders.map((o) => (
        <div
          key={o.id}
          className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="font-serif text-xl text-foreground">{o.order_number}</p>
              <p className="text-sm text-muted">
                Placed on {new Date(o.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={o.status as OrderStatus} />
              <span className="font-medium text-foreground">
                {formatPrice(o.total, o.currency)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 py-5 text-sm">
            {o.items.map((it, i) => (
              <span key={i} className="text-muted">
                <span className="font-medium text-foreground">{it.name}</span> ×{" "}
                {it.quantity}
              </span>
            ))}
          </div>

          <div className="rounded-2xl bg-surface-muted/40 p-5">
            <OrderTimeline status={o.status as OrderStatus} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {o.tracking && (
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-sm">
                <Truck className="h-4 w-4" />
                Tracking: {o.tracking}
              </span>
            )}
            <Link
              href={`/track?order=${o.order_number}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-muted"
            >
              Track this order
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
