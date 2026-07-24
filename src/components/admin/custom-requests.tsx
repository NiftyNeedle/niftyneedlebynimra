"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  updateCustomOrderStatus,
  deleteCustomOrder,
} from "@/app/admin/custom-orders/actions";

export interface CustomOrder {
  id: string;
  status: string;
  title: string | null;
  product_type: string | null;
  occasion: string | null;
  description: string | null;
  colors: string | null;
  size: string | null;
  budget: string | null;
  deadline: string | null;
  quantity: number | null;
  gift_wrapping: string | null;
  pinterest: string | null;
  instagram: string | null;
  special_instructions: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  address: string | null;
  preferred_contact: string | null;
  reference_images: string[];
  created_at: string;
}

const STATUSES = ["New", "Quoted", "Approved", "In Production", "Completed", "Rejected"];

export function CustomRequests({ requests }: { requests: CustomOrder[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const setStatus = (id: string, status: string) =>
    startTransition(async () => {
      try {
        await updateCustomOrderStatus(id, status);
        toast(`Marked as ${status}`);
        router.refresh();
      } catch {
        toast("Couldn't update status", "info");
      }
    });

  const remove = (o: CustomOrder) => {
    if (!confirm(`Delete request from ${o.name ?? "customer"}?`)) return;
    startTransition(async () => {
      try {
        await deleteCustomOrder(o.id);
        toast("Request deleted");
        router.refresh();
      } catch {
        toast("Couldn't delete", "info");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Custom order requests
        </h1>
        <p className="text-sm text-muted">
          {requests.length} request{requests.length === 1 ? "" : "s"}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="font-serif text-2xl text-foreground">No requests yet</p>
          <p className="mt-1 text-muted">
            Submissions from the Custom Orders page will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl text-foreground">
                    {r.name ?? "Unnamed"}
                  </p>
                  <p className="text-sm text-muted">
                    {r.title ?? r.product_type ?? "Custom request"} ·{" "}
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-primary">
                  {r.status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-muted">Occasion</dt>
                  <dd className="font-medium text-foreground">{r.occasion ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Budget</dt>
                  <dd className="font-medium text-foreground">{r.budget ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted">Deadline</dt>
                  <dd className="font-medium text-foreground">{r.deadline ?? "—"}</dd>
                </div>
              </dl>

              {r.description && (
                <p className="mt-4 rounded-2xl bg-surface-muted/50 p-4 text-sm text-muted">
                  {r.description}
                </p>
              )}

              {(r.colors || r.size || r.quantity || r.gift_wrapping) && (
                <p className="mt-3 text-xs text-muted">
                  {[
                    r.colors && `Colours: ${r.colors}`,
                    r.size && `Size: ${r.size}`,
                    r.quantity && `Qty: ${r.quantity}`,
                    r.gift_wrapping && `Gift wrap: ${r.gift_wrapping}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}

              {r.reference_images.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-medium text-foreground">
                    Reference images
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {r.reference_images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Reference ${i + 1}`}
                          className="h-20 w-20 rounded-lg object-cover transition-transform hover:scale-105"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-1 text-sm text-muted">
                <p>
                  <span className="text-foreground">Contact:</span> {r.email ?? "—"}
                  {r.phone ? ` · ${r.phone}` : ""}
                  {r.preferred_contact ? ` · prefers ${r.preferred_contact}` : ""}
                </p>
                {r.address && (
                  <p>
                    <span className="text-foreground">Ship to:</span> {r.address}
                    {r.country ? `, ${r.country}` : ""}
                  </p>
                )}
                {(r.pinterest || r.instagram) && (
                  <p className="flex gap-3">
                    {r.pinterest && (
                      <a href={r.pinterest} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Pinterest
                      </a>
                    )}
                    {r.instagram && (
                      <a href={r.instagram} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                        Instagram
                      </a>
                    )}
                  </p>
                )}
                {r.special_instructions && (
                  <p>
                    <span className="text-foreground">Notes:</span>{" "}
                    {r.special_instructions}
                  </p>
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                <label className="text-sm text-muted">Status</label>
                <select
                  value={r.status}
                  disabled={pending}
                  onChange={(e) => setStatus(r.id, e.target.value)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <a
                  href={`mailto:${r.email ?? ""}`}
                  className="rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface-muted"
                >
                  Reply by email
                </a>
                <button
                  onClick={() => remove(r)}
                  disabled={pending}
                  aria-label="Delete request"
                  className="ml-auto grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
