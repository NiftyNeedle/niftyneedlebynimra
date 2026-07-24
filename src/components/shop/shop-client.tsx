"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products, categories, allColors } from "@/lib/data";
import { ProductCard } from "@/components/home/product-card";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function ShopClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "all";

  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(100);
  const [colors, setColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (category !== "all" && p.categorySlug !== category) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()))
        return false;
      const effectivePrice = p.salePrice ?? p.price;
      if (effectivePrice > maxPrice) return false;
      if (colors.length && !p.colors.some((c) => colors.includes(c)))
        return false;
      if (inStockOnly && !p.inStock) return false;
      if (customizableOnly && !p.customizable) return false;
      return true;
    });

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
      case "price-asc":
        list = [...list].sort(
          (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
        );
        break;
      case "price-desc":
        list = [...list].sort(
          (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
        );
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort(
          (a, b) => Number(!!b.isBestSeller) - Number(!!a.isBestSeller),
        );
    }
    return list;
  }, [category, query, maxPrice, colors, inStockOnly, customizableOnly, sort]);

  const toggleColor = (c: string) =>
    setColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setMaxPrice(100);
    setColors([]);
    setInStockOnly(false);
    setCustomizableOnly(false);
  };

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-3 font-serif text-lg text-foreground">Category</h3>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-xl px-3 py-2 text-left text-sm transition-colors",
              category === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-surface-muted",
            )}
          >
            All Products
          </button>
          {categories
            .filter((c) => c.slug !== "custom-orders")
            .map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                  category === c.slug
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-surface-muted",
                )}
              >
                <span>{c.icon}</span>
                {c.name}
              </button>
            ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-serif text-lg text-foreground">
          Max Price: ${maxPrice}
        </h3>
        <input
          type="range"
          min={10}
          max={100}
          step={2}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[var(--color-primary)]"
          aria-label="Maximum price"
        />
      </div>

      <div>
        <h3 className="mb-3 font-serif text-lg text-foreground">Colour</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => (
            <button
              key={c}
              onClick={() => toggleColor(c)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                colors.includes(c)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-surface-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          In stock only
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={customizableOnly}
            onChange={(e) => setCustomizableOnly(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          Customizable only
        </label>
      </div>

      <button
        onClick={resetFilters}
        className="text-sm font-medium text-accent hover:underline"
      >
        Reset all filters
      </button>
    </div>
  );

  return (
    <div className="section-px mx-auto max-w-[90rem] py-12">
      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          <span className="hidden text-sm text-muted sm:block">
            {filtered.length} items
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
            className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">{Filters}</div>
        </aside>

        {/* Grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border py-24 text-center">
              <span className="text-5xl">🧶</span>
              <p className="font-serif text-2xl text-foreground">
                No pieces match your filters
              </p>
              <p className="text-muted">Try adjusting or resetting them.</p>
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-accent hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-[60] bg-espresso/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed left-0 top-0 z-[60] flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-surface p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-serif text-2xl">Filters</h2>
                <button
                  aria-label="Close filters"
                  onClick={() => setFiltersOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              {Filters}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
