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
  /** Placeholder gradient used until real imagery is uploaded to Storage. */
  swatch: string;
  colors: string[];
  materials: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  customizable?: boolean;
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
