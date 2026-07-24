"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Upload,
} from "lucide-react";
import { type Product, ALL_CUSTOMIZATION } from "@/lib/types";
import type { Review } from "@/lib/reviews";
import { formatPrice, cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { ProductCard } from "@/components/home/product-card";

const yarnTypes = [
  { label: "Premium Cotton", price: 0 },
  { label: "Merino Wool", price: 8 },
  { label: "Bamboo Silk", price: 12 },
];
const sizes = [
  { label: "Small", price: 0 },
  { label: "Medium", price: 6 },
  { label: "Large", price: 14 },
];

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
  const wishlisted = isWishlisted(product.id);

  // Which options this product offers (all-on if customizable with none set).
  const cz = product.customizable
    ? product.customization ?? ALL_CUSTOMIZATION
    : null;

  const [color, setColor] = useState(product.colors[0]);
  const [yarn, setYarn] = useState(yarnTypes[0].label);
  const [size, setSize] = useState(sizes[0].label);
  const [name, setName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Description");

  const base = product.salePrice ?? product.price;
  const unitPrice = useMemo(() => {
    const yarnAdd = cz?.yarn ? yarnTypes.find((y) => y.label === yarn)?.price ?? 0 : 0;
    const sizeAdd = cz?.size ? sizes.find((s) => s.label === size)?.price ?? 0 : 0;
    return base + yarnAdd + sizeAdd;
  }, [base, yarn, size, cz]);

  const productionDays = useMemo(() => {
    let d = 5;
    if (cz?.size && size === "Large") d += 3;
    if (cz?.yarn && yarn !== "Premium Cotton") d += 2;
    if ((cz?.name && name) || (cz?.giftMessage && giftMessage)) d += 1;
    return d;
  }, [size, yarn, name, giftMessage, cz]);

  const hasPhoto = Boolean(product.imageUrl);
  const gallery = [product.swatch, product.swatch, product.swatch, product.swatch];

  const handleAdd = () => {
    const options: Record<string, string> = {};
    if (cz?.color && color) options.Colour = color;
    if (cz?.yarn) options.Yarn = yarn;
    if (cz?.size) options.Size = size;
    if (cz?.name && name) options.Name = name;
    addToCart(product, {
      quantity,
      options: cz && Object.keys(options).length ? options : undefined,
    });
    toast(`${product.name} added to cart`);
  };

  return (
    <div className="section-px mx-auto max-w-[90rem] py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.div
            key={activeImg}
            initial={{ opacity: 0.4, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative aspect-square overflow-hidden rounded-[2rem] border border-border"
            style={hasPhoto ? undefined : { background: gallery[activeImg] }}
          >
            {hasPhoto && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
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
          {!hasPhoto && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "aspect-square overflow-hidden rounded-2xl border-2 transition-all",
                    activeImg === i
                      ? "border-primary"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                  style={{ background: g }}
                />
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
              {formatPrice(unitPrice, product.currency)}
            </span>
            {product.salePrice && (
              <span className="text-lg text-muted line-through">
                {formatPrice(product.price, product.currency)}
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
              {product.inStock ? "In stock" : "Made to order"}
            </span>
          </div>

          {/* Customization */}
          {product.customizable && (
            <div className="mt-8 space-y-6 rounded-3xl border border-border bg-surface-muted/50 p-6">
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <BadgeCheck className="h-4 w-4" /> Customizable — make it yours
              </p>

              {cz?.color && product.colors.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-medium">Colour</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm transition-colors",
                          color === c
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-surface",
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(cz?.yarn || cz?.size) && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {cz?.yarn && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Yarn Type
                      </label>
                      <select
                        value={yarn}
                        onChange={(e) => setYarn(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {yarnTypes.map((y) => (
                          <option key={y.label} value={y.label}>
                            {y.label}
                            {y.price ? ` (+${formatPrice(y.price)})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {cz?.size && (
                    <div>
                      <label className="mb-2 block text-sm font-medium">Size</label>
                      <select
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                      >
                        {sizes.map((s) => (
                          <option key={s.label} value={s.label}>
                            {s.label}
                            {s.price ? ` (+${formatPrice(s.price)})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {cz?.name && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Personalized Name{" "}
                    <span className="text-muted">(optional)</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Emma"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {cz?.giftMessage && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Gift Message <span className="text-muted">(optional)</span>
                  </label>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    rows={2}
                    placeholder="A little note to include…"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {cz?.instructions && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Special Instructions{" "}
                    <span className="text-muted">(optional)</span>
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={2}
                    placeholder="Any special requests?"
                    className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}

              {cz?.referenceImage && (
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brown/40 bg-surface px-4 py-4 text-sm text-muted transition-colors hover:border-brown hover:text-foreground"
                >
                  <Upload className="h-4 w-4" />
                  Upload a reference image
                </button>
              )}

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
              className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to cart · {formatPrice(unitPrice * quantity, product.currency)}
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
              Free shipping over $75
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
              then sent with tracking. Free shipping on orders over $75, and
              every order is wrapped and packed with care.
            </p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="font-serif text-3xl font-semibold text-foreground">
          Customer Reviews
        </h2>
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
              <h3 className="mt-3 font-serif text-lg text-foreground">
                {r.title}
              </h3>
              {r.hasPhoto && (
                <div className="mt-3 h-28 rounded-2xl bg-[linear-gradient(135deg,#f3d7d2,#d3a7a1)]" />
              )}
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                “{r.body}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-sm">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-muted font-serif text-xs font-semibold text-primary">
                  {r.initials}
                </span>
                <span className="flex flex-col">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    {r.author}
                    {r.verified && (
                      <BadgeCheck className="h-3.5 w-3.5 text-sage-deep" />
                    )}
                  </span>
                  <span className="text-xs text-muted">
                    {r.verified ? "Verified purchase" : ""}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

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
