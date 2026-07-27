"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileText, ImageIcon, Plus, Trash2, X } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  upsertPattern,
  togglePatternPublished,
  deletePattern,
  type PatternActionState,
} from "@/app/admin/patterns/actions";

export interface AdminPattern {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  finished_size: string | null;
  difficulty: string | null;
  price: number;
  is_free: boolean;
  image_url: string | null;
  published: boolean;
  created_at: string;
  has_pdf: boolean;
}

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function PatternsManager({
  patterns,
  notSetUp,
  salesCount,
  salesTotal,
}: {
  patterns: AdminPattern[];
  notSetUp: boolean;
  salesCount: number;
  salesTotal: number;
}) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<AdminPattern | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  const toggle = (p: AdminPattern) =>
    startTransition(async () => {
      const res = await togglePatternPublished(p.id, !p.published);
      if (res.error) toast(res.error, "info");
      else {
        toast(p.published ? "Pattern hidden" : "Pattern published");
        router.refresh();
      }
    });

  const del = (p: AdminPattern) => {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deletePattern(p.id);
      if (res.error) toast(res.error, "info");
      else {
        toast("Pattern deleted");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Patterns
          </h1>
          <p className="text-sm text-muted">
            Digital PDF patterns — buyers get the file by email automatically.
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
          New pattern
        </button>
      </div>

      {!notSetUp && (
        <div className="flex flex-wrap gap-4">
          <div className="rounded-2xl border border-border bg-surface px-5 py-3 shadow-[var(--shadow-soft)]">
            <p className="text-xs text-muted">Pattern sales</p>
            <p className="font-serif text-2xl font-semibold text-foreground">
              {salesCount}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface px-5 py-3 shadow-[var(--shadow-soft)]">
            <p className="text-xs text-muted">Pattern revenue</p>
            <p className="font-serif text-2xl font-semibold text-foreground">
              {formatPrice(salesTotal)}
            </p>
          </div>
        </div>
      )}

      {notSetUp && (
        <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-4 text-sm text-muted">
          The patterns database isn&apos;t set up yet. Run{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">
            supabase/patterns.sql
          </code>{" "}
          in your Supabase SQL editor, then reload this page.
        </div>
      )}

      {patterns.length === 0
        ? !notSetUp && (
            <div className="rounded-3xl border border-dashed border-border py-16 text-center">
              <p className="text-muted">No patterns yet — add your first one.</p>
            </div>
          )
        : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {patterns.map((p) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex flex-col overflow-hidden rounded-3xl border bg-surface shadow-[var(--shadow-soft)]",
                    p.published ? "border-border" : "border-border opacity-70",
                  )}
                >
                  <div className="relative h-36 bg-surface-muted">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-muted">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    <span
                      className={cn(
                        "absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        p.is_free
                          ? "bg-sage/20 text-sage-deep"
                          : "bg-surface/90 text-foreground",
                      )}
                    >
                      {p.is_free ? "Free" : formatPrice(p.price)}
                    </span>
                    {!p.published && (
                      <span className="absolute right-3 top-3 rounded-full bg-espresso/70 px-2.5 py-0.5 text-xs font-medium text-white">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-lg text-foreground">
                      {p.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
                      {p.description}
                    </p>
                    <p
                      className={cn(
                        "mt-3 inline-flex items-center gap-1.5 text-xs",
                        p.has_pdf ? "text-sage-deep" : "text-accent",
                      )}
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {p.has_pdf ? "PDF uploaded" : "No PDF yet"}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-sm">
                      <button
                        disabled={pending}
                        onClick={() => toggle(p)}
                        className="font-medium text-accent hover:underline disabled:opacity-50"
                      >
                        {p.published ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        disabled={pending}
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="font-medium text-accent hover:underline disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        disabled={pending}
                        onClick={() => del(p)}
                        aria-label="Delete pattern"
                        className="ml-auto grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

      {showForm && (
        <PatternForm
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

function PatternForm({
  editing,
  onClose,
  onSaved,
}: {
  editing: AdminPattern | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState<
    PatternActionState,
    FormData
  >(upsertPattern, {});
  const [isFree, setIsFree] = useState(editing?.is_free ?? false);

  useEffect(() => {
    if (state.ok) {
      toast(editing ? "Pattern updated" : "Pattern created");
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
        className="my-8 w-full max-w-2xl rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-lift)] md:p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">
            {editing ? "Edit pattern" : "New pattern"}
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
              Title
            </label>
            <input
              name="title"
              required
              defaultValue={editing?.title}
              placeholder="Amigurumi Bunny Pattern"
              className={field}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Finished size{" "}
                <span className="font-normal text-muted">(what it makes)</span>
              </label>
              <input
                name="finished_size"
                defaultValue={editing?.finished_size ?? ""}
                placeholder="Makes a 25cm tall bunny"
                className={field}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Difficulty
              </label>
              <input
                name="difficulty"
                defaultValue={editing?.difficulty ?? ""}
                placeholder="Beginner"
                className={field}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              URL slug{" "}
              <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              name="slug"
              defaultValue={editing?.slug ?? ""}
              placeholder="auto from title"
              className={`${field} font-mono`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              defaultValue={editing?.description ?? ""}
              placeholder={"What the pattern includes, skill level, materials needed…\n\nLeave a blank line between paragraphs."}
              className={`${field} resize-y leading-relaxed`}
            />
          </div>

          {/* Pricing */}
          <div className="rounded-2xl border border-border p-4">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                name="is_free"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              This pattern is free
            </label>
            {!isFree && (
              <div className="mt-3">
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Price (USD)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={
                    editing && !editing.is_free ? editing.price : ""
                  }
                  placeholder="6.00"
                  className={`${field} max-w-40`}
                />
              </div>
            )}
          </div>

          {/* Files */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Cover photo{" "}
                <span className="font-normal text-muted">
                  {editing?.image_url ? "(leave empty to keep)" : "(optional)"}
                </span>
              </label>
              {editing?.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={editing.image_url}
                  alt=""
                  className="mb-2 h-24 w-full rounded-xl object-cover"
                />
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Pattern PDF{" "}
                <span className="font-normal text-muted">
                  {editing?.has_pdf ? "(leave empty to keep)" : "(required)"}
                </span>
              </label>
              {editing?.has_pdf && (
                <p className="mb-2 inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-2 text-xs text-sage-deep">
                  <FileText className="h-3.5 w-3.5" />
                  A PDF is already uploaded
                </p>
              )}
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
              />
              <p className="mt-1 text-xs text-muted">
                Stored privately — only ever delivered by email.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="published"
              defaultChecked={editing ? editing.published : true}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Published (visible on the patterns page)
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
            {pending ? "Saving…" : "Save pattern"}
          </button>
        </div>
      </form>
    </div>
  );
}
