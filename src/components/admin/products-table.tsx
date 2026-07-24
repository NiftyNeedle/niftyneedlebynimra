"use client";

import { useState } from "react";
import {
  Copy,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function ProductsTable() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Products
          </h1>
          <p className="text-sm text-muted">{products.length} total products</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toast("Bulk import — connect Supabase to enable", "info")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-muted"
          >
            <Upload className="h-4 w-4" />
            Bulk import
          </button>
          <button
            onClick={() => toast("New product form opens here")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-full border border-border bg-surface py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]">
        <table className="w-full min-w-[42rem] text-left text-sm">
          <thead className="border-b border-border text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="px-5 py-4 font-medium">Product</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Price</th>
              <th className="px-5 py-4 font-medium">Stock</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-border last:border-0 hover:bg-surface-muted/40"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-11 w-11 shrink-0 rounded-xl"
                      style={{ background: p.swatch }}
                    />
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 capitalize text-muted">
                  {p.categorySlug.replace(/-/g, " ")}
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {formatPrice(p.salePrice ?? p.price)}
                </td>
                <td className="px-5 py-4 text-muted">
                  {p.inStock ? "In stock" : "0"}
                </td>
                <td className="px-5 py-4">
                  <span className="flex flex-wrap gap-1">
                    {p.isNew && (
                      <span className="rounded-full bg-sage/15 px-2 py-0.5 text-xs text-sage-deep">
                        New
                      </span>
                    )}
                    {p.isBestSeller && (
                      <span className="rounded-full bg-pink/20 px-2 py-0.5 text-xs text-pink-deep">
                        Best seller
                      </span>
                    )}
                    {p.customizable && (
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-primary">
                        Custom
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      aria-label="Edit"
                      onClick={() => toast(`Editing ${p.name}`)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Duplicate"
                      onClick={() => toast(`Duplicated ${p.name}`)}
                      className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      aria-label="Delete"
                      onClick={() => toast(`Deleted ${p.name}`, "info")}
                      className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
