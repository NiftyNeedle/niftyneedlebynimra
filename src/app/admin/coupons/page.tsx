import { Plus, Tag } from "lucide-react";

const coupons = [
  { code: "WELCOME10", type: "10% off", min: "$0", uses: "142 / ∞", expires: "No expiry", active: true },
  { code: "LOVE15", type: "15% off", min: "$60", uses: "38 / 200", expires: "2026-12-31", active: true },
  { code: "FREESHIP", type: "Free shipping", min: "$40", uses: "76 / ∞", expires: "2026-09-30", active: true },
  { code: "SUMMER25", type: "$25 off", min: "$120", uses: "12 / 50", expires: "2026-08-01", active: false },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Coupons
        </h1>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" />
          New coupon
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 font-mono text-sm font-semibold text-primary">
                <Tag className="h-3.5 w-3.5" />
                {c.code}
              </span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  c.active ? "bg-sage-deep" : "bg-muted"
                }`}
                title={c.active ? "Active" : "Inactive"}
              />
            </div>
            <p className="mt-4 font-serif text-2xl font-semibold text-foreground">
              {c.type}
            </p>
            <dl className="mt-3 space-y-1 text-sm text-muted">
              <div className="flex justify-between">
                <dt>Min. purchase</dt>
                <dd>{c.min}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Uses</dt>
                <dd>{c.uses}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Expires</dt>
                <dd>{c.expires}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
