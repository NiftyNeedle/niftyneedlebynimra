"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  upsertCoupon,
  toggleCoupon,
  deleteCoupon,
  type CouponState,
} from "@/app/admin/coupons/actions";

export interface AdminCoupon {
  id: string;
  code: string;
  rate: number;
  description: string | null;
  active: boolean;
}

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function CouponsManager({ coupons }: { coupons: AdminCoupon[] }) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<AdminCoupon | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  const toggle = (c: AdminCoupon) =>
    startTransition(async () => {
      try {
        await toggleCoupon(c.id, !c.active);
        toast(c.active ? "Coupon disabled" : "Coupon enabled");
        router.refresh();
      } catch {
        toast("Couldn't update coupon", "info");
      }
    });

  const del = (c: AdminCoupon) => {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    startTransition(async () => {
      try {
        await deleteCoupon(c.id);
        toast("Coupon deleted");
        router.refresh();
      } catch {
        toast("Couldn't delete coupon", "info");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Coupons
          </h1>
          <p className="text-sm text-muted">
            Discount codes customers enter at the cart.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          New coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-16 text-center">
          <p className="text-muted">No coupons yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => {
            // Built-in codes exist only in code (shown when the coupons table
            // isn't set up). They have no real DB row, so they can't be
            // edited or deleted — guard against acting on their synthetic id.
            const isBuiltin = c.id.startsWith("builtin-");
            return (
            <div
              key={c.id}
              className={cn(
                "rounded-3xl border bg-surface p-6 shadow-[var(--shadow-soft)]",
                c.active ? "border-border" : "border-border opacity-60",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-3 py-1 font-mono text-sm font-semibold text-primary">
                  <Tag className="h-3.5 w-3.5" />
                  {c.code}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    c.active
                      ? "bg-sage/20 text-sage-deep"
                      : "bg-surface-muted text-muted",
                  )}
                >
                  {c.active ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="mt-4 font-serif text-3xl font-semibold text-foreground">
                {Math.round(c.rate * 100)}% off
              </p>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
                {isBuiltin ? (
                  <span className="text-xs text-muted">
                    Built-in code — set up the coupons table to manage codes.
                  </span>
                ) : (
                  <>
                    <button
                      disabled={pending}
                      onClick={() => toggle(c)}
                      className="font-medium text-accent hover:underline disabled:opacity-50"
                    >
                      {c.active ? "Disable" : "Enable"}
                    </button>
                    <button
                      disabled={pending}
                      onClick={() => {
                        setEditing(c);
                        setShowForm(true);
                      }}
                      className="font-medium text-accent hover:underline disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      disabled={pending}
                      onClick={() => del(c)}
                      aria-label="Delete coupon"
                      className="ml-auto grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <CouponForm
          key={editing?.id ?? "new"}
          editing={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function CouponForm({
  editing,
  onClose,
  onSaved,
}: {
  editing: AdminCoupon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState<CouponState, FormData>(
    upsertCoupon,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      toast(editing ? "Coupon updated" : "Coupon created");
      onSaved();
    } else if (state.error) {
      toast(state.error, "info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-espresso/40 p-4 backdrop-blur-sm">
      <form
        action={formAction}
        className="my-8 w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-lift)] md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">
            {editing ? "Edit coupon" : "New coupon"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {editing && <input type="hidden" name="id" value={editing.id} />}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Code
            </label>
            <input
              name="code"
              required
              defaultValue={editing?.code}
              placeholder="e.g. SUMMER20"
              className={`${field} font-mono uppercase`}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Discount %
            </label>
            <input
              name="percent"
              type="number"
              min="1"
              max="100"
              required
              defaultValue={editing ? Math.round(editing.rate * 100) : ""}
              placeholder="10"
              className={field}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <input
              name="description"
              defaultValue={editing?.description ?? ""}
              placeholder="10% off your order"
              className={field}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="active"
              defaultChecked={editing ? editing.active : true}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Active
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}
