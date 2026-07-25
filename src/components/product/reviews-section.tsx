"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { Review } from "@/lib/reviews";
import {
  submitReview,
  type ReviewState,
} from "@/app/product/[slug]/review-actions";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function ReviewsSection({
  productId,
  slug,
  rating,
  reviews,
}: {
  productId: string;
  slug: string;
  rating: number;
  reviews: Review[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [hover, setHover] = useState(0);
  const [state, formAction, pending] = useActionState<ReviewState, FormData>(
    submitReview,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      toast("Thank you for your review!");
      setOpen(false);
      setStars(5);
      router.refresh();
    } else if (state.error) {
      toast(state.error, "info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="mt-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-3xl font-semibold text-foreground">
          Customer Reviews
        </h2>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface-muted"
        >
          {open ? "Close" : "Write a review"}
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-muted">
        <span className="flex text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn("h-4 w-4", i < Math.round(rating) && "fill-current")}
            />
          ))}
        </span>
        <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
        <span>
          · {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Write a review */}
      {open && (
        <form
          action={formAction}
          className="mt-6 space-y-4 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
        >
          <input type="hidden" name="product_id" value={productId} />
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="rating" value={stars} />

          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">
              Your rating
            </p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStars(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={cn(
                        "h-7 w-7 text-accent transition-transform hover:scale-110",
                        n <= (hover || stars) && "fill-current",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <input
            name="author"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            name="body"
            required
            rows={3}
            placeholder="What did you think?"
            className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {pending ? "Submitting…" : "Submit review"}
          </button>
        </form>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border py-12 text-center">
          <p className="text-muted">
            No reviews yet — be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.id}
              className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex text-accent">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                “{r.body}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-muted font-serif text-xs font-semibold text-primary">
                  {initials(r.author)}
                </span>
                <span className="flex flex-col">
                  <span className="font-medium text-foreground">{r.author}</span>
                  <span className="text-xs text-muted">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
