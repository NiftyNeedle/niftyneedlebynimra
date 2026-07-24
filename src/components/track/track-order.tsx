"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { getOrder, type Order } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { OrderTimeline, StatusBadge } from "@/components/account/order-timeline";

export function TrackOrder() {
  const [id, setId] = useState("");
  const [result, setResult] = useState<Order | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(getOrder(id.trim().toUpperCase()) ?? null);
    setSearched(true);
  };

  return (
    <div className="section-px mx-auto max-w-3xl py-12">
      <form
        onSubmit={handleSearch}
        className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:flex-row"
      >
        <div className="relative flex-1">
          <PackageSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your order number (try NN-1042)"
            className="w-full rounded-full border border-border bg-surface-muted/40 py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground">
          Track order
        </button>
      </form>

      {searched && !result && (
        <div className="mt-8 rounded-3xl border border-dashed border-border py-16 text-center">
          <p className="font-serif text-2xl text-foreground">
            No order found
          </p>
          <p className="mt-1 text-muted">
            Double-check your order number and try again.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="font-serif text-2xl text-foreground">{result.id}</p>
              <p className="text-sm text-muted">Placed on {result.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={result.status} />
              <span className="font-medium text-foreground">
                {formatPrice(result.total)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 py-5">
            {result.items.map((it, i) => (
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
            <OrderTimeline status={result.status} />
          </div>
          {result.tracking && (
            <p className="mt-4 text-sm text-muted">
              Carrier tracking:{" "}
              <span className="font-medium text-foreground">
                {result.tracking}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
