"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import {
  upsertPost,
  togglePublished,
  deletePost,
  type BlogActionState,
} from "@/app/admin/blog/actions";

export interface AdminPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  content: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

const field =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

export function BlogManager({
  posts,
  notSetUp,
}: {
  posts: AdminPost[];
  notSetUp: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [editing, setEditing] = useState<AdminPost | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pending, startTransition] = useTransition();

  const toggle = (p: AdminPost) =>
    startTransition(async () => {
      const res = await togglePublished(p.id, !p.published);
      if (res.error) toast(res.error, "info");
      else {
        toast(p.published ? "Post hidden" : "Post published");
        router.refresh();
      }
    });

  const del = (p: AdminPost) => {
    if (!confirm(`Delete "${p.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const res = await deletePost(p.id);
      if (res.error) toast(res.error, "info");
      else {
        toast("Post deleted");
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Blog
          </h1>
          <p className="text-sm text-muted">
            Write stories that appear on your public blog.
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
          New post
        </button>
      </div>

      {notSetUp && (
        <div className="rounded-2xl border border-dashed border-border bg-surface-muted/50 p-4 text-sm text-muted">
          The blog database isn&apos;t set up yet. Run{" "}
          <code className="rounded bg-surface px-1.5 py-0.5">
            supabase/blog.sql
          </code>{" "}
          in your Supabase SQL editor, then reload this page.
        </div>
      )}

      {posts.length === 0 ? (
        !notSetUp && (
          <div className="rounded-3xl border border-dashed border-border py-16 text-center">
            <p className="text-muted">No posts yet — write your first story.</p>
          </div>
        )
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
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
                    p.published
                      ? "bg-sage/20 text-sage-deep"
                      : "bg-espresso/70 text-white",
                  )}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {p.category}
                </span>
                <h3 className="mt-1 font-serif text-lg text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">
                  {p.excerpt}
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
                    aria-label="Delete post"
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
        <PostForm
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

function PostForm({
  editing,
  onClose,
  onSaved,
}: {
  editing: AdminPost | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState<BlogActionState, FormData>(
    upsertPost,
    {},
  );

  useEffect(() => {
    if (state.ok) {
      toast(editing ? "Post updated" : "Post created");
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
            {editing ? "Edit post" : "New post"}
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
              placeholder="How to care for your crochet flowers"
              className={field}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Category
              </label>
              <input
                name="category"
                defaultValue={editing?.category ?? ""}
                placeholder="Crochet Care"
                className={field}
              />
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
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Excerpt{" "}
              <span className="font-normal text-muted">
                (short summary shown in the list)
              </span>
            </label>
            <input
              name="excerpt"
              defaultValue={editing?.excerpt ?? ""}
              placeholder="A one-line teaser for this post"
              className={field}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Content
            </label>
            <textarea
              name="content"
              required
              rows={10}
              defaultValue={editing?.content}
              placeholder={"Write your story here.\n\nLeave a blank line between paragraphs."}
              className={`${field} resize-y leading-relaxed`}
            />
            <p className="mt-1 text-xs text-muted">
              Separate paragraphs with a blank line.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Cover photo{" "}
              <span className="font-normal text-muted">
                {editing?.image_url ? "(leave empty to keep current)" : "(optional)"}
              </span>
            </label>
            {editing?.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={editing.image_url}
                alt=""
                className="mb-2 h-28 w-full rounded-xl object-cover"
              />
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              className="block w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              name="published"
              defaultChecked={editing ? editing.published : true}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            Published (visible on the public blog)
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
            {pending ? "Saving…" : "Save post"}
          </button>
        </div>
      </form>
    </div>
  );
}
