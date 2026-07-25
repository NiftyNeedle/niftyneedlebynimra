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
  accent: "brown" | "sage" | "pink";
}

export interface ProductImage {
  url: string;
  alt: string;
}

/** A single choice within a customization dropdown (e.g. a yarn or size).
 *  `price` is added on top of the product's base price. */
export interface CustomizationOption {
  label: string;
  price: number;
}

/** Which customization options a product offers to customers.
 *  When a product is customizable but this is absent, all are treated as on. */
export interface ProductCustomization {
  color?: boolean;
  /** Admin-defined colour choices; falls back to `product.colors`. */
  colorOptions?: CustomizationOption[];
  yarn?: boolean;
  /** Admin-defined yarn choices; falls back to defaults when empty. */
  yarnOptions?: CustomizationOption[];
  size?: boolean;
  /** Admin-defined size choices; falls back to defaults when empty. */
  sizeOptions?: CustomizationOption[];
  name?: boolean;
  giftMessage?: boolean;
  instructions?: boolean;
}

/** Every customization option enabled — the back-compat default. */
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
