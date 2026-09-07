/**
 * Core domain types for Nifty Needle.
 * These mirror the intended Supabase schema so the storefront can be
 * wired to the real backend later with minimal changes.
 */

export type Currency = "USD" | "PKR" | "AED" | "EUR" | "GBP" | "CAD" | "AUD" | "INR";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Emoji or short icon token used by the storefront cards. */
  icon: string;
  productCount: number;
  /** @deprecated categories no longer carry a colour — kept optional so old data still compiles. */
  accent?: "brown" | "sage" | "pink";
}

export interface ProductImage {
  url: string;
  alt: string;
}

/** How many photos one product can carry (the first is the cover). */
export const MAX_PRODUCT_IMAGES = 5;

/** A single choice within a customization field (e.g. a colour or size).
 *  `price` is added on top of the product's base price. */
export interface CustomizationOption {
  label: string;
  price: number;
}

/** How a customization field is presented to the customer:
 *  `choice` = pick one of the admin's options, `text` = one-line input,
 *  `note` = multi-line input. Only `choice` fields can carry a price. */
export type CustomizationFieldType = "choice" | "text" | "note";

/** One admin-defined customization field. Every product defines its own
 *  set, so a bouquet can ask for flower type while a blanket asks for
 *  pattern and size — nothing is predefined. */
export interface CustomizationField {
  /** Slug of the label; stable identity for the field. */
  id: string;
  /** Shown to the customer, and used as the key in cart/order options. */
  label: string;
  type: CustomizationFieldType;
  /** `choice` fields only — the first option is the default selection. */
  options?: CustomizationOption[];
  /** Hint shown inside a `text`/`note` field. */
  placeholder?: string;
  /** `text`/`note` fields only — a choice always has a value. */
  required?: boolean;
}

/** What a product lets customers customize.
 *  `fields` is the current shape; the flags below it are the old fixed
 *  colour/yarn/size shape, still read for products saved before the
 *  dynamic editor (see `customizationFields` in lib/customization.ts). */
export interface ProductCustomization {
  fields?: CustomizationField[];
  /* ── legacy shape: read for back-compat, never written any more ── */
  color?: boolean;
  colorOptions?: CustomizationOption[];
  yarn?: boolean;
  yarnOptions?: CustomizationOption[];
  size?: boolean;
  sizeOptions?: CustomizationOption[];
  name?: boolean;
  giftMessage?: boolean;
  instructions?: boolean;
}

/** Legacy default: a customizable product with no saved customization
 *  offered every fixed option. Only used when converting old rows. */
export const ALL_CUSTOMIZATION: ProductCustomization = {
  color: true,
  yarn: true,
  size: true,
  name: true,
  giftMessage: true,
  instructions: true,
};

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number;
  /** Optional sale price; when present, `price` is treated as the original. */
  salePrice?: number;
  currency: Currency;
  rating: number;
  reviewCount: number;
  images: ProductImage[];
  /** Real product photo (Supabase Storage URL). Falls back to `swatch`. */
  imageUrl?: string;
  /** Placeholder gradient used until real imagery is uploaded to Storage. */
  swatch: string;
  colors: string[];
  materials: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  customizable?: boolean;
  customization?: ProductCustomization;
  inStock: boolean;
  shortDescription: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  verified: boolean;
  initials: string;
}
