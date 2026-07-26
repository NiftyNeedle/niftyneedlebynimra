"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { orderStages } from "@/lib/orders";
import { useToast } from "@/components/ui/toast";
import { updateOrderStatus, setOrderTracking } from "@/app/admin/orders/actions";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, string> | null;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  shipping_method: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  tracking: string | null;
  created_at: string;
}

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [open, setOpen] = useState<string | null>(null);

  const changeStatus = (id: string, status: string) =>
    startTransition(async () => {
      try {
        await updateOrderStatus(id, status);
        toast(`Order marked ${status}`);
        router.refresh();
      } catch {
        toast("Couldn't update order", "info");
      }
    });

  const saveTracking = (id: string, value: string) =>
    startTransition(async () => {
      try {
        await setOrderTracking(id, value);
        toast("Tracking saved");
        router.refresh();
      } catch {
        toast("Couldn't save tracking", "info");
      }
    });

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-serif text-3xl font-semibold text-foreground">Orders</h1>
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="font-serif text-2xl text-foreground">No orders yet</p>
          <p className="mt-1 text-muted">
            Orders placed at checkout will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-foreground">Orders</h1>

      <div className="space-y-4">
        {orders.map((o) => {
          const isOpen = open === o.id;
          const qty = o.items.reduce((n, i) => n + i.quantity, 0);
          return (
            <div
              key={o.id}
              className="rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]"
            >
              <button
                onClick={() => setOpen(isOpen ? null : o.id)}
                className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left"
              >
                <div>
                  <p className="font-serif text-lg text-foreground">
                    {o.order_number}
                  </p>
                  <p className="text-sm text-muted">
                    {o.name ?? "—"} · {new Date(o.created_at).toLocaleDateString()}{" "}
                    · {qty} item{qty === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-primary">
                    {o.status}
                  </span>
                  <span className="font-medium text-foreground">
                    {formatPrice(o.total, o.currency)}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="space-y-5 border-t border-border p-5">
                  {/* Items */}
                  <div className="space-y-2">
                    {o.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {it.name} × {it.quantity}
                          {it.options && (
                            <span className="text-muted">
                              {" "}
                              (
                              {Object.entries(it.options)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                              )
                            </span>
                          )}
                        </span>
                        <span className="font-medium">
                          {formatPrice(it.price * it.quantity, o.currency)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between border-t border-border pt-2 text-sm text-muted">
                      <span>Subtotal / Shipping / Tax</span>
                      <span>
                        {formatPrice(o.subtotal, o.currency)} ·{" "}
                        {o.shipping === 0 ? "Free" : formatPrice(o.shipping, o.currency)} ·{" "}
                        {formatPrice(o.tax, o.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="rounded-2xl bg-surface-muted/50 p-4 text-sm text-muted">
                    <p>
                      <span className="text-foreground">Contact:</span> {o.email ?? "—"}
                      {o.phone ? ` · ${o.phone}` : ""}
                    </p>
                    {o.address && (
                      <p>
                        <span className="text-foreground">Ship to:</span> {o.address},{" "}
                        {o.city} {o.postal_code}, {o.country}
                      </p>
                    )}
                    {o.shipping_method && (
                      <p>
                        <span className="text-foreground">Method:</span>{" "}
                        {o.shipping_method}
                      </p>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap items-end gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted">
                        Status
                      </label>
                      <select
                        value={o.status}
                        disabled={pending}
                        onChange={(e) => changeStatus(o.id, e.target.value)}
                        className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {(orderStages as readonly string[]).includes(o.status)
                          ? null
                          : <option key={o.status}>{o.status}</option>}
                        {orderStages.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <TrackingField
                      initial={o.tracking ?? ""}
                      disabled={pending}
                      onSave={(v) => saveTracking(o.id, v)}
                    />
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                        o.email ?? "",
                      )}&su=${encodeURIComponent(
                        `Your Nifty Needle order ${o.order_number}`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface-muted"
                    >
                      Email customer
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TrackingField({
  initial,
  disabled,
  onSave,
}: {
  initial: string;
  disabled: boolean;
  onSave: (v: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">
        Tracking number
      </label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add tracking…"
          className="w-40 rounded-full border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="button"
          disabled={disabled || value === initial}
          onClick={() => onSave(value)}
          className="rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}
