"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Pencil, Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  upsertAddress,
  deleteAddress,
  setDefaultAddress,
  type AddressState,
} from "@/app/account/addresses/actions";

export interface Address {
  id: string;
  label: string | null;
  name: string | null;
  line: string | null;
  city: string | null;
  postal_code: string | null;
  country: string | null;
  is_default: boolean;
}

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function AddressesManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  const del = (a: Address) => {
    if (!confirm("Delete this address?")) return;
    startTransition(async () => {
      const r = await deleteAddress(a.id);
      if (r.error) toast(r.error, "info");
      else {
        toast("Address deleted");
        router.refresh();
      }
    });
  };

  const makeDefault = (a: Address) =>
    startTransition(async () => {
      const r = await setDefaultAddress(a.id);
      if (r.error) toast(r.error, "info");
      else {
        toast("Default address set");
        router.refresh();
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Saved addresses</h2>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Add address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-16 text-center">
          <p className="text-muted">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {a.label}
                  {a.is_default && (
                    <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs text-sage-deep">
                      Default
                    </span>
                  )}
                </span>
                <div className="flex gap-1">
                  <button
                    aria-label="Edit"
                    onClick={() => {
                      setEditing(a);
                      setShowForm(true);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Delete"
                    disabled={pending}
                    onClick={() => del(a)}
                    className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-0.5 text-sm text-muted">
                <p className="font-medium text-foreground">{a.name}</p>
                <p>{a.line}</p>
                <p>
                  {a.city} {a.postal_code}
                </p>
                <p>{a.country}</p>
              </div>
              {!a.is_default && (
                <button
                  disabled={pending}
                  onClick={() => makeDefault(a)}
                  className="mt-4 text-sm font-medium text-accent hover:underline disabled:opacity-50"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <AddressForm
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

function AddressForm({
  editing,
  onClose,
  onSaved,
}: {
  editing: Address | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState<AddressState, FormData>(
    upsertAddress,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      toast(editing ? "Address updated" : "Address added");
      onSaved();
    } else if (state.error) {
      toast(state.error, "info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-espresso/40 p-3 backdrop-blur-sm sm:p-4">
      <form
        action={formAction}
        className="my-6 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-lift)] sm:my-8 md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">
            {editing ? "Edit address" : "Add address"}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="label" defaultValue={editing?.label ?? ""} placeholder="Label (e.g. Home)" className={field} />
          <input name="name" defaultValue={editing?.name ?? ""} placeholder="Full name" className={field} />
          <input name="line" defaultValue={editing?.line ?? ""} placeholder="Address" className={`${field} sm:col-span-2`} />
          <input name="city" defaultValue={editing?.city ?? ""} placeholder="City" className={field} />
          <input name="postal_code" defaultValue={editing?.postal_code ?? ""} placeholder="Postal code" className={field} />
          <input name="country" defaultValue={editing?.country ?? ""} placeholder="Country" className={`${field} sm:col-span-2`} />
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="is_default"
            defaultChecked={editing?.is_default}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          Set as default address
        </label>

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
            {pending ? "Saving…" : "Save address"}
          </button>
        </div>
      </form>
    </div>
  );
}
