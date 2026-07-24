import { formatPrice } from "@/lib/utils";

const customers = [
  { name: "Amelia R.", email: "amelia@example.com", orders: 8, spent: 640, location: "London, UK" },
  { name: "Sofia M.", email: "sofia@example.com", orders: 5, spent: 412, location: "Dubai, UAE" },
  { name: "Hannah K.", email: "hannah@example.com", orders: 12, spent: 980, location: "Toronto, CA" },
  { name: "Priya S.", email: "priya@example.com", orders: 3, spent: 198, location: "Mumbai, IN" },
  { name: "Jordan M.", email: "jordan@example.com", orders: 6, spent: 524, location: "Austin, US" },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Customers
      </h1>
      <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-4 font-medium">Customer</th>
              <th className="px-5 py-4 font-medium">Location</th>
              <th className="px-5 py-4 font-medium">Orders</th>
              <th className="px-5 py-4 font-medium">Total spent</th>
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
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{c.name}</p>
                      <p className="text-xs text-muted">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted">{c.location}</td>
                <td className="px-5 py-4 text-muted">{c.orders}</td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {formatPrice(c.spent)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
