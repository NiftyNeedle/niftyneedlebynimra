"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, EyeOff, Star, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import { setReviewApproved, deleteReview } from "@/app/admin/reviews/actions";

export interface AdminReview {
  id: string;
  product_id: string;
  productName: string;
  author: string;
  rating: number;
  body: string;
  approved: boolean;
  created_at: string;
}

export function ReviewsManager({ reviews }: { reviews: AdminReview[] }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const pendingCount = reviews.filter((r) => !r.approved).length;

  const approve = (r: AdminReview, approved: boolean) =>
    startTransition(async () => {
      try {
        await setReviewApproved(r.id, approved);
        toast(approved ? "Review approved" : "Review hidden");
        router.refresh();
      } catch {
        toast("Couldn't update review", "info");
      }
    });

  const remove = (r: AdminReview) => {
    if (!confirm("Delete this review permanently?")) return;
    startTransition(async () => {
      try {
        await deleteReview(r.id);
        toast("Review deleted");
        router.refresh();
      } catch {
        toast("Couldn't delete review", "info");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Reviews
        </h1>
        <p className="text-sm text-muted">
          {reviews.length} total · {pendingCount} awaiting approval
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <p className="font-serif text-2xl text-foreground">No reviews yet</p>
          <p className="mt-1 text-muted">
            Customer reviews will appear here for approval.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={cn(
                "rounded-3xl border bg-surface p-5 shadow-[var(--shadow-soft)]",
                r.approved ? "border-border" : "border-accent/40",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex text-accent">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {r.author}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        r.approved
                          ? "bg-sage/20 text-sage-deep"
                          : "bg-accent/15 text-accent",
                      )}
                    >
                      {r.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    on {r.productName} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {r.approved ? (
                    <button
                      disabled={pending}
                      onClick={() => approve(r, false)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-surface-muted disabled:opacity-50"
                    >
                      <EyeOff className="h-4 w-4" />
                      Hide
                    </button>
                  ) : (
                    <button
                      disabled={pending}
                      onClick={() => approve(r, true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                  )}
                  <button
                    disabled={pending}
                    onClick={() => remove(r)}
                    aria-label="Delete review"
                    className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 rounded-2xl bg-surface-muted/50 p-4 text-sm text-muted">
                “{r.body}”
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
