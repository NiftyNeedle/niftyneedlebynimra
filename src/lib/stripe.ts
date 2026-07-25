import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY;

/** True when Stripe is configured. */
export const isStripeConfigured = Boolean(secret);

/** Server-only Stripe client, or null when no key is set. */
export function getStripe(): Stripe | null {
  if (!secret) return null;
  return new Stripe(secret);
}

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://niftyneedlebynimra.vercel.app"
  );
}
