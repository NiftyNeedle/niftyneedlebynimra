import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for your handmade crochet order.",
};

export default function CheckoutPage() {
  return <CheckoutView stripeEnabled={isStripeConfigured} />;
}
