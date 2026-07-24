import { orders } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/account/order-timeline";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Orders
      </h1>
      <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-4 font-medium">Order</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Items</th>
              <th className="px-5 py-4 font-medium">Total</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-border last:border-0 hover:bg-surface-muted/40"
              >
                <td className="px-5 py-4 font-medium text-foreground">{o.id}</td>
                <td className="px-5 py-4 text-muted">{o.date}</td>
                <td className="px-5 py-4 text-muted">
                  {o.items.reduce((n, i) => n + i.quantity, 0)} items
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {formatPrice(o.total)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-5 py-4 text-right">
                  <select
                    defaultValue={o.status}
                    className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Order Received</option>
                    <option>In Production</option>
                    <option>Quality Check</option>
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
