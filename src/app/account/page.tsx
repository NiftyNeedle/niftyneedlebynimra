import Link from "next/link";
import { Heart, Package, Sparkles, Wallet } from "lucide-react";
import { getMyOrders, getMyWishlistCount } from "@/lib/account";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/account/order-timeline";
import type { OrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function AccountDashboard() {
  const [orders, wishlistCount] = await Promise.all([
    getMyOrders(),
    getMyWishlistCount(),
  ]);
  const totalSpent = orders.reduce((n, o) => n + Number(o.total), 0);

  const stats = [
    { label: "Total Orders", value: String(orders.length), Icon: Package },
    { label: "Total Spent", value: formatPrice(totalSpent), Icon: Wallet },
    { label: "Wishlist Items", value: String(wishlistCount), Icon: Heart },
    { label: "Saved Designs", value: "0", Icon: Sparkles },
  ];

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
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-12 text-center">
            <p className="text-muted">You haven&apos;t placed any orders yet.</p>
            <Link
              href="/shop"
              className="mt-2 inline-block text-sm font-medium text-accent hover:underline"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-2xl border border-border p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{o.order_number}</p>
                  <p className="text-sm text-muted">
                    {new Date(o.created_at).toLocaleDateString()} ·{" "}
                    {o.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={o.status as OrderStatus} />
                  <span className="font-medium text-foreground">
                    {formatPrice(o.total, o.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
