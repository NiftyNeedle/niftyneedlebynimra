import { Tag } from "lucide-react";
import { COUPONS } from "@/lib/coupons";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Coupons
        </h1>
        <p className="text-sm text-muted">
          Active discount codes customers can use at the cart.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COUPONS.map((c) => (
          <div
            key={c.code}
            className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 font-mono text-sm font-semibold text-primary">
              <Tag className="h-3.5 w-3.5" />
              {c.code}
            </span>
            <p className="mt-4 font-serif text-3xl font-semibold text-foreground">
              {Math.round(c.rate * 100)}% off
            </p>
            <p className="mt-1 text-sm text-muted">{c.description}</p>
          </div>
        ))}
      </div>

      <p className="rounded-2xl border border-border bg-surface-muted/40 p-4 text-sm text-muted">
        Coupon codes are configured in the site&apos;s code
        (<span className="font-mono">src/lib/coupons.ts</span>). Ask your
        developer to add, change, or remove a code — or we can build a
        self-serve coupon manager here later.
      </p>
    </div>
  );
}
