import { getCustomers } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Customers
        </h1>
        <p className="text-sm text-muted">
          {customers.length} customer{customers.length === 1 ? "" : "s"} · built
          from real orders
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="font-serif text-2xl text-foreground">No customers yet</p>
          <p className="mt-1 text-muted">
            People who place orders will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Orders</th>
                <th className="px-5 py-4 font-medium">Total spent</th>
                <th className="px-5 py-4 font-medium">Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.email}
                  className="border-b border-border last:border-0 hover:bg-surface-muted/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-muted font-serif text-xs font-semibold text-primary">
                        {c.name
                          .split(" ")
                          .map((n) => n[0])
                          .filter(Boolean)
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "?"}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted">{c.orders}</td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {formatPrice(c.spent)}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {new Date(c.lastOrder).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
