import { Check, Mail, X } from "lucide-react";
import type { Metadata } from "next";
import { getStripe } from "@/lib/stripe";
import { fulfillPatternPurchase } from "@/lib/patterns-fulfill";
import { ButtonLink } from "@/components/ui/button";
import { CartClearer } from "@/components/checkout/cart-clearer";

export const metadata: Metadata = {
  title: "Pattern purchased",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function PatternSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sp = await searchParams;
  let paid = false;
  let email: string | null = null;

  if (sp.session_id) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sp.session_id);
        if (session.payment_status === "paid") {
          paid = true;
          email =
            session.customer_details?.email ?? session.customer_email ?? null;
          // Idempotent — safe even if the webhook already fulfilled it.
          await fulfillPatternPurchase({
            id: session.id,
            customer_email: session.customer_email,
            customer_details: session.customer_details,
            amount_total: session.amount_total,
            metadata: session.metadata as { pattern_id?: string } | null,
          });
        }
      } catch {
        paid = false;
      }
    }
  }

  if (!paid) {
    return (
      <div className="section-px mx-auto flex max-w-2xl flex-col items-center justify-center gap-5 py-32 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-accent/15 text-accent">
          <X className="h-10 w-10" />
        </span>
        <h1 className="font-serif text-4xl font-semibold text-foreground">
          Payment not completed
        </h1>
        <p className="max-w-md text-muted">
          Your payment wasn&apos;t finished, so nothing was charged.
        </p>
        <ButtonLink href="/patterns">Back to patterns</ButtonLink>
      </div>
    );
  }

  return (
    <div className="section-px mx-auto flex max-w-2xl flex-col items-center justify-center gap-5 py-32 text-center">
      <CartClearer />
      <span className="grid h-24 w-24 place-items-center rounded-full bg-sage-deep text-white">
        <Check className="h-12 w-12" />
      </span>
      <h1 className="font-serif text-4xl font-semibold text-foreground">
        Thank you! Your pattern is on its way 🧶
      </h1>
      <p className="flex max-w-md items-center justify-center gap-2 text-muted">
        <Mail className="h-4 w-4" />
        {email
          ? `We've emailed your PDF to ${email}.`
          : "We've emailed your PDF to you."}
      </p>
      <p className="max-w-md text-sm text-muted">
        It should arrive within a minute — please check your spam folder if you
        don&apos;t see it. The email also has a backup download link.
      </p>
      <div className="mt-4 flex gap-3">
        <ButtonLink href="/patterns" variant="outline">
          Browse more patterns
        </ButtonLink>
      </div>
    </div>
  );
}
