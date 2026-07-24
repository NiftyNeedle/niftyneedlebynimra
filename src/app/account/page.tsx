import Link from "next/link";
import { Heart, Package, Sparkles, Wallet } from "lucide-react";
import { orders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/account/order-timeline";

const stats = [
  { label: "Total Orders", value: orders.length.toString(), Icon: Package },
  {
    label: "Total Spent",
    value: formatPrice(orders.reduce((n, o) => n + o.total, 0)),
    Icon: Wallet,
  },
  { label: "Wishlist Items", value: "—", Icon: Heart },
  { label: "Saved Designs", value: "2", Icon: Sparkles },
];

export default function AccountDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-muted text-primary">
              <s.Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-serif text-3xl font-semibold text-foreground">
              {s.value}
            </p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">Recent orders</h2>
          <Link
            href="/account/orders"
            className="text-sm font-medium text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {orders.slice(0, 3).map((o) => (
            <Link
              key={o.id}
              href={`/account/orders`}
              className="flex items-center justify-between rounded-2xl border border-border p-4 transition-colors hover:bg-surface-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {o.items.map((it, i) => (
                    <span
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-surface"
                      style={{ background: it.swatch }}
                    />
                  ))}
                </div>
                <div>
                  <p className="font-medium text-foreground">{o.id}</p>
                  <p className="text-sm text-muted">{o.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={o.status} />
                <span className="font-medium text-foreground">
                  {formatPrice(o.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
