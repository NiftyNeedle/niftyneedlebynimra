"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import type { Product } from "@/lib/types";
import type { Review } from "@/lib/reviews";
import { customizationFields, optionPrice } from "@/lib/customization";
import { unitPriceFor } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { useCurrency } from "@/components/currency/currency-provider";
import { ProductCard } from "@/components/home/product-card";
import { ReviewsSection } from "./reviews-section";

const tabs = ["Description", "Materials", "Care", "Shipping"] as const;

export function ProductDetail({
  product,
  reviews,
  related,
}: {
  product: Product;
  reviews: Review[];
  related: Product[];
}) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const toast = useToast();
  const { format } = useCurrency();
  const wishlisted = isWishlisted(product.id);

  // Whatever this product's admin decided it can be customized with.
  const fields = useMemo(() => customizationFields(product), [product]);

  // One answer per field, keyed by label (also the cart option key).
  // Choice fields start on their first option; text fields start empty.
  const [answers, setAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [
        f.label,
        f.type === "choice" ? f.options?.[0]?.label ?? "" : "",
      ]),
    ),
  );
  const answer = (f: (typeof fields)[number]) => answers[f.label] ?? "";
  const setAnswer = (label: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [label]: value }));

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");

  // Priced by the shared helper the cart and checkout use, so the number
  // shown here is the number charged.
  const unitPrice = useMemo(
    () => unitPriceFor(product, answers),
    [product, answers],
  );

  const productionDays = useMemo(() => {
    // Base turnaround, plus a little for up-charged choices (they take
    // more work) and for anything hand-personalised.
    const upcharged = fields.some(
      (f) => optionPrice(f, answers[f.label]) > 0,
    );
    const personalised = fields.some(
      (f) => f.type !== "choice" && (answers[f.label] ?? "").trim(),
    );
    return 5 + (upcharged ? 3 : 0) + (personalised ? 1 : 0);
  }, [fields, answers]);

  // Up to MAX_PRODUCT_IMAGES photos; the swatch stands in when there are none.
  const photos = product.images.map((i) => i.url).filter(Boolean);
  const hasPhotos = photos.length > 0;
  const canSwitch = photos.length > 1;
  const go = (dir: number) =>
    setActiveImg((i) => (i + dir + photos.length) % photos.length);

  const handleAdd = () => {
    const missing = fields.find((f) => f.required && !answer(f).trim());
    if (missing) {
      toast(`Please fill in “${missing.label}” first.`, "info");
      return;
    }

    // Only answered fields travel with the line (an empty optional note
    // shouldn't clutter the cart, the order or the confirmation email).
    const options: Record<string, string> = {};
    for (const f of fields) {
      const value = answer(f).trim();
      if (value) options[f.label] = value;
    }
    addToCart(product, {
      quantity,
      options: Object.keys(options).length ? options : undefined,
    });
    toast(`${product.name} added to cart`);
  };

  return (
    <div className="section-px mx-auto max-w-[90rem] py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div
            tabIndex={canSwitch ? 0 : undefined}
            aria-roledescription={canSwitch ? "carousel" : undefined}
            aria-label={
              canSwitch
                ? `${product.name} photos — use the left and right arrow keys to switch`
                : undefined
            }
            onKeyDown={(e) => {
              if (!canSwitch) return;
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                go(-1);
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                go(1);
              }
            }}
            className="relative rounded-[2rem] outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <motion.div
              key={activeImg}
              initial={{ opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-square overflow-hidden rounded-[2rem] border border-border"
              style={hasPhotos ? undefined : { background: product.swatch }}
            >
              {hasPhotos && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photos[activeImg]}
                  alt={product.images[activeImg]?.alt ?? product.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/10 to-transparent" />
              {product.isNew && (
                <span className="absolute left-5 top-5 rounded-full bg-sage-deep px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                  New
                </span>
              )}
            </motion.div>

            {canSwitch && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/85 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:bg-surface hover:shadow-[var(--shadow-lift)]"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-surface/85 text-foreground shadow-[var(--shadow-soft)] backdrop-blur transition-all hover:bg-surface hover:shadow-[var(--shadow-lift)]"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <span className="absolute bottom-4 right-4 rounded-full bg-espresso/70 px-2.5 py-1 text-xs font-medium text-white">
                  {activeImg + 1} / {photos.length}
                </span>
              </>
            )}
          </div>

          {canSwitch && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {photos.map((url, i) => (
                <button
                  key={`${i}-${url}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-current={activeImg === i}
                  className={cn(
                    "aspect-square overflow-hidden rounded-2xl border-2 transition-all",
                    activeImg === i
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info + customization */}
        <div>
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="flex text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.round(product.rating) && "fill-current",
                  )}
                />
              ))}
            </span>
            <span className="font-medium text-foreground">{product.rating}</span>
            <span>· {product.reviewCount} reviews</span>
          </div>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-foreground md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-muted">{product.shortDescription}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-semibold text-foreground">
              {format(unitPrice, product.currency)}
            </span>
            {product.salePrice && (
              <span className="text-lg text-muted line-through">
                {format(product.price, product.currency)}
              </span>
            )}
            <span
              className={cn(
                "ml-auto rounded-full px-3 py-1 text-xs font-medium",
                product.inStock
                  ? "bg-sage/20 text-sage-deep"
                  : "bg-accent/15 text-accent",
              )}
            >
              {product.inStock ? "In stock" : "Out of stock"}
            </span>
          </div>

          {/* Customization — whatever fields this product defines */}
          {fields.length > 0 && (
            <div className="mt-8 space-y-6 rounded-3xl border border-border bg-surface-muted/50 p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <BadgeCheck className="h-4 w-4" /> Customizable — make it yours
              </p>

              {fields.map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={`cz-${f.id}`}
                    className="mb-2 block text-sm font-medium"
                  >
                    {f.label}{" "}
                    {f.type !== "choice" && (
                      <span className="text-muted">
                        {f.required ? "(required)" : "(optional)"}
                      </span>
                    )}
                  </label>

                  {/* A handful of choices reads better as chips; a long
                      list stays a dropdown. */}
                  {f.type === "choice" &&
                    ((f.options?.length ?? 0) <= 6 ? (
                      <div className="flex flex-wrap gap-2">
                        {f.options?.map((o) => (
                          <button
                            key={o.label}
                            type="button"
                            onClick={() => setAnswer(f.label, o.label)}
                            className={cn(
                              "rounded-full border px-4 py-2 text-sm transition-colors",
                              answer(f) === o.label
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:bg-surface",
                            )}
                          >
                            {o.label}
                            {o.price ? ` (+${format(o.price)})` : ""}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <select
                        id={`cz-${f.id}`}
                        value={answer(f)}
                        onChange={(e) => setAnswer(f.label, e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {f.options?.map((o) => (
                          <option key={o.label} value={o.label}>
                            {o.label}
                            {o.price ? ` (+${format(o.price)})` : ""}
                          </option>
                        ))}
                      </select>
                    ))}

                  {f.type === "text" && (
                    <input
                      id={`cz-${f.id}`}
                      value={answer(f)}
                      onChange={(e) => setAnswer(f.label, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}

                  {f.type === "note" && (
                    <textarea
                      id={`cz-${f.id}`}
                      value={answer(f)}
                      onChange={(e) => setAnswer(f.label, e.target.value)}
                      rows={2}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />
                  )}
                </div>
              ))}

              <p className="text-sm text-muted">
                Estimated production time:{" "}
                <span className="font-medium text-foreground">
                  {productionDays}–{productionDays + 3} days
                </span>
              </p>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full border border-border p-1">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface-muted"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[var(--shadow-soft)]"
            >
              <ShoppingBag className="h-5 w-5" />
              {product.inStock
                ? `Add to cart · ${format(unitPrice * quantity, product.currency)}`
                : "Out of stock"}
            </button>

            <button
              aria-label="Add to wishlist"
              onClick={() => {
                toggleWishlist(product.id);
                toast(
                  wishlisted ? "Removed from wishlist" : "Added to wishlist",
                  "info",
                );
              }}
              className={cn(
                "grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-surface-muted",
                wishlisted && "border-accent bg-accent text-white",
              )}
            >
              <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted">
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface-muted/60 p-3">
              <Truck className="h-5 w-5 text-primary" />
              Tracked shipping
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface-muted/60 p-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Secure checkout
            </div>
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface-muted/60 p-3">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Handmade to order
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-20">
        <div className="flex flex-wrap gap-2 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "relative px-5 py-3 text-sm font-medium transition-colors",
                tab === t ? "text-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {t}
              {tab === t && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
        <div className="max-w-3xl py-8 text-muted leading-relaxed">
          {tab === "Description" && (
            <p>
              {product.name} is lovingly crocheted by hand in our home studio.
              {" "}
              {product.shortDescription} Each piece is made to order, so slight
              variations are part of its handmade charm — no two are ever exactly
              alike.
            </p>
          )}
          {tab === "Materials" && (
            <ul className="list-inside list-disc space-y-1">
              {product.materials.map((m) => (
                <li key={m}>{m}</li>
              ))}
              <li>Available colours: {product.colors.join(", ")}</li>
            </ul>
          )}
          {tab === "Care" && (
            <p>
              Spot clean with a damp cloth and mild soap. Reshape while damp and
              air-dry flat, away from direct heat or sunlight. Avoid machine
              washing to preserve the stitches.
            </p>
          )}
          {tab === "Shipping" && (
            <p>
              Made to order within {productionDays}–{productionDays + 3} days,
              then sent with tracking. Every order is wrapped and packed with
              care.
            </p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSection
        productId={product.id}
        slug={product.slug}
        rating={product.rating}
        reviews={reviews}
      />

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground">
            You may also love
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
