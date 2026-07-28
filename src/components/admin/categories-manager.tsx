"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  upsertCategory,
  deleteCategory,
  type CategoryActionState,
} from "@/app/admin/categories/actions";

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function CategoriesManager({
  categories,
  counts,
  notSetUp,
}: {
  categories: AdminCategory[];
  counts: Record<string, number>;
  notSetUp: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  const del = (c: AdminCategory) => {
    const n = counts[c.slug] ?? 0;
    const warn = n
      ? `Delete "${c.name}"? ${n} product${n === 1 ? "" : "s"} use it and will keep the tag but lose the category.`
      : `Delete "${c.name}"?`;
    if (!confirm(warn)) return;
    startTransition(async () => {
      const res = await deleteCategory(c.id);
      if (res.error) toast(res.error, "info");
      else {
        toast("Category deleted");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Categories
          </h1>
          <p className="text-sm text-muted">
            Collections shown in the shop filter, navbar, and home page.
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
          New category
        </button>
      </div>

      {notSetUp && (
        <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-4 text-sm text-muted">
          The categories database isn&apos;t set up yet. Run{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">
            supabase/categories.sql
          </code>{" "}
          in your Supabase SQL editor, then reload this page.
        </div>
      )}

      {categories.length === 0
        ? !notSetUp && (
            <div className="rounded-3xl border border-dashed border-border py-16 text-center">
              <p className="text-muted">
                No categories yet — add your first collection.
              </p>
            </div>
          )
        : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
                >
                  <span className="text-3xl">{c.icon}</span>
                  <h3 className="mt-3 font-serif text-lg text-foreground">
                    {c.name}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-muted">
                    {c.description}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted">/{c.slug}</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-sm">
                    <span className="text-xs text-muted">
                      {counts[c.slug] ?? 0} product
                      {(counts[c.slug] ?? 0) === 1 ? "" : "s"}
                    </span>
                    <button
                      disabled={pending}
                      onClick={() => {
                        setEditing(c);
                        setShowForm(true);
                      }}
                      className="ml-auto font-medium text-accent hover:underline disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      disabled={pending}
                      onClick={() => del(c)}
                      aria-label="Delete category"
                      className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

      {showForm && (
        <CategoryForm
          key={editing?.id ?? "new"}
          editing={editing}
          count={categories.length}
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

function CategoryForm({
  editing,
  count,
  onClose,
  onSaved,
}: {
  editing: AdminCategory | null;
  count: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState<
    CategoryActionState,
    FormData
  >(upsertCategory, {});

  useEffect(() => {
    if (state.ok) {
      toast(editing ? "Category updated" : "Category created");
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
            {editing ? "Edit category" : "New category"}
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
        <input
          type="hidden"
          name="sort_order"
          defaultValue={editing ? undefined : count + 1}
        />
        <div className="space-y-4">
          <div className="grid grid-cols-[5rem_1fr] gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Icon
              </label>
              <input
                name="icon"
                defaultValue={editing?.icon ?? "🧶"}
                placeholder="🌸"
                className={`${field} text-center text-lg`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                name="name"
                required
                defaultValue={editing?.name}
                placeholder="Crochet Flowers"
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
              placeholder="auto from name"
              className={`${field} font-mono`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Description
            </label>
            <input
              name="description"
              defaultValue={editing?.description ?? ""}
              placeholder="Everlasting blooms that never wilt."
              className={field}
            />
          </div>
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
            {pending ? "Saving…" : "Save category"}
          </button>
        </div>
      </form>
    </div>
  );
}
