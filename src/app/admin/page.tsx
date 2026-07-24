import Link from "next/link";
import {
  ArrowUpRight,
  DollarSign,
  Eye,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
import { products } from "@/lib/data";
import { orders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { StatusBadge } from "@/components/account/order-timeline";

const stats = [
  { label: "Revenue (30d)", value: "$840", delta: "+18%", Icon: DollarSign },
  { label: "Orders (30d)", value: "14", delta: "+9%", Icon: Package },
  { label: "Customers", value: "63", delta: "+12%", Icon: Users },
  { label: "Visitors (30d)", value: "1,240", delta: "+7%", Icon: Eye },
];

const popular = products.filter((p) => p.isBestSeller).slice(0, 5);
const lowStock = products.filter((p) => !p.inStock);

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted">
            Welcome back — here&apos;s how the studio is doing.
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
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface-muted text-primary">
                <s.Icon className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-sage/15 px-2 py-0.5 text-xs font-medium text-sage-deep">
                <ArrowUpRight className="h-3 w-3" />
                {s.delta}
              </span>
            </div>
            <p className="mt-4 font-serif text-3xl font-semibold text-foreground">
              {s.value}
            </p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Revenue chart */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">
              Revenue overview
            </h2>
            <span className="text-sm text-muted">2026</span>
          </div>
          <RevenueChart />
        </div>

        {/* Low stock */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 flex items-center gap-2 font-serif text-xl text-foreground">
            <AlertTriangle className="h-5 w-5 text-accent" />
            Low stock alerts
          </h2>
          {lowStock.length === 0 ? (
            <p className="text-sm text-muted">Everything is well stocked.</p>
          ) : (
            <div className="space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span
                    className="h-10 w-10 rounded-xl"
                    style={{ background: p.swatch }}
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
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="mb-3 text-sm font-medium text-foreground">
              Abandoned carts
            </h3>
            <p className="text-sm text-muted">
              2 carts worth <span className="font-medium">$88</span> —{" "}
              <Link href="#" className="text-accent hover:underline">
                send reminder
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular products */}
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 font-serif text-xl text-foreground">
            Popular products
          </h2>
          <div className="space-y-3">
            {popular.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-4 text-sm font-semibold text-muted">
                  {i + 1}
                </span>
                <span
                  className="h-10 w-10 rounded-xl"
                  style={{ background: p.swatch }}
                />
                <span className="flex-1 text-sm font-medium text-foreground">
                  {p.name}
                </span>
                <span className="text-sm text-muted">
                  {p.reviewCount} sold
                </span>
              </div>
            ))}
          </div>
        </div>

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
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-2xl border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{o.id}</p>
                  <p className="text-xs text-muted">{o.date}</p>
                </div>
                <StatusBadge status={o.status} />
                <span className="text-sm font-medium text-foreground">
                  {formatPrice(o.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
