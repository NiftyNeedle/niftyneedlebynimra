import { Download, Truck } from "lucide-react";
import { orders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { OrderTimeline, StatusBadge } from "@/components/account/order-timeline";

export default function OrdersPage() {
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
              <p className="font-serif text-xl text-foreground">{o.id}</p>
              <p className="text-sm text-muted">Placed on {o.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={o.status} />
              <span className="font-medium text-foreground">
                {formatPrice(o.total)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 py-5">
            {o.items.map((it, i) => (
              <div key={i} className="flex items-center gap-3">
                <span
                  className="h-14 w-14 rounded-2xl"
                  style={{ background: it.swatch }}
                />
                <span className="text-sm">
                  <span className="block font-medium text-foreground">
                    {it.name}
                  </span>
                  <span className="text-muted">Qty {it.quantity}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-surface-muted/40 p-5">
            <OrderTimeline status={o.status} />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {o.tracking && (
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-2 text-sm">
                <Truck className="h-4 w-4" />
                Tracking: {o.tracking}
              </span>
            )}
            <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-surface-muted">
              <Download className="h-4 w-4" />
              Invoice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
