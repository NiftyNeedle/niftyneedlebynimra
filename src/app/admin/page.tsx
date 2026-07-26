import Link from "next/link";
import {
  AlertTriangle,
  Box,
  DollarSign,
  Package,
  Sparkles,
  Star,
} from "lucide-react";
import { getDashboardData } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/account/order-timeline";
import type { OrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const d = await getDashboardData();

  const stats = [
    { label: "Revenue (paid)", value: formatPrice(d.revenue), Icon: DollarSign },
    { label: "Orders", value: String(d.orderCount), Icon: Package },
    { label: "Products", value: String(d.productCount), Icon: Box },
    { label: "New custom requests", value: String(d.customNew), Icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted">
            A live snapshot of your shop.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          + Add product
        </Link>
      </div>

      {/* Stats */}
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

      {/* Attention row */}
      {d.pendingReviews > 0 && (
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 font-medium transition-colors hover:bg-surface-muted"
          >
            <Star className="h-4 w-4 text-accent" />
            {d.pendingReviews} review{d.pendingReviews === 1 ? "" : "s"} awaiting approval
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-accent hover:underline"
            >
              View all
            </Link>
          </div>
          {d.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {d.recentOrders.map((o) => (
                <div
                  key={o.order_number}
                  className="flex items-center justify-between rounded-2xl border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {o.order_number}
                    </p>
                    <p className="text-xs text-muted">
                      {o.name ?? "—"} · {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status as OrderStatus} />
                    <span className="text-sm font-medium text-foreground">
                      {formatPrice(o.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock + popular */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-foreground">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Out of stock
            </h2>
            {d.lowStock.length === 0 ? (
              <p className="text-sm text-muted">Everything is in stock. 🧶</p>
            ) : (
              <div className="space-y-3">
                {d.lowStock.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span
                      className="h-10 w-10 rounded-xl bg-cover bg-center"
                      style={
                        p.image_url
                          ? { backgroundImage: `url(${p.image_url})` }
                          : { background: p.swatch }
                      }
                    />
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs text-accent">
                      Out of stock
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
            <h2 className="mb-4 font-serif text-xl text-foreground">
              Best selling
            </h2>
            {d.popular.length === 0 ? (
              <p className="text-sm text-muted">No sales yet.</p>
            ) : (
              <div className="space-y-3">
                {d.popular.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="w-4 text-sm font-semibold text-muted">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="text-sm text-muted">
                      {p.units} sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
