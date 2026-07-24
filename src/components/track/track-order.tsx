"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { PackageSearch } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/lib/orders";
import { OrderTimeline, StatusBadge } from "@/components/account/order-timeline";
import { lookupOrder, type TrackedOrder } from "@/app/track/actions";

export function TrackOrder() {
  const searchParams = useSearchParams();
  const [id, setId] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [pending, startTransition] = useTransition();
  const autoRan = useRef(false);

  const runLookup = (value: string) =>
    startTransition(async () => {
      const found = await lookupOrder(value);
      setResult(found);
      setSearched(true);
    });

  // Auto-lookup when arriving from checkout (?order=NN-1042).
  useEffect(() => {
    const fromQuery = searchParams.get("order");
    if (fromQuery && !autoRan.current) {
      autoRan.current = true;
      setId(fromQuery);
      runLookup(fromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="section-px mx-auto max-w-3xl py-12">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runLookup(id);
        }}
        className="flex flex-col gap-3 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:flex-row"
      >
        <div className="relative flex-1">
          <PackageSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your order number (e.g. NN-1001)"
            className="w-full rounded-full border border-border bg-surface-muted/40 py-3 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          disabled={pending}
          className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {pending ? "Searching…" : "Track order"}
        </button>
      </form>

      {searched && !result && !pending && (
        <div className="mt-8 rounded-3xl border border-dashed border-border py-16 text-center">
          <p className="font-serif text-2xl text-foreground">No order found</p>
          <p className="mt-1 text-muted">
            Double-check your order number and try again.
          </p>
        </div>
      )}

      {result && (
        <div className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <p className="font-serif text-2xl text-foreground">
                {result.order_number}
              </p>
              <p className="text-sm text-muted">
                Placed on {new Date(result.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={result.status as OrderStatus} />
              <span className="font-medium text-foreground">
                {formatPrice(result.total, result.currency)}
              </span>
            </div>
          </div>

          {result.items?.length > 0 && (
            <div className="flex flex-wrap gap-4 py-5 text-sm">
              {result.items.map((it, i) => (
                <span key={i} className="text-muted">
                  <span className="font-medium text-foreground">{it.name}</span> ×{" "}
                  {it.quantity}
                </span>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-surface-muted/40 p-5">
            <OrderTimeline status={result.status as OrderStatus} />
          </div>
          {result.tracking && (
            <p className="mt-4 text-sm text-muted">
              Carrier tracking:{" "}
              <span className="font-medium text-foreground">{result.tracking}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
