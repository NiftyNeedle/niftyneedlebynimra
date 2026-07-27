"use client";

import { useActionState, useEffect } from "react";
import { Download } from "lucide-react";
import {
  startPatternCheckout,
  type BuyPatternState,
} from "@/app/patterns/actions";
import { useToast } from "@/components/ui/toast";
import { useCurrency } from "@/components/currency/currency-provider";

export function BuyPatternButton({
  patternId,
  slug,
  price,
}: {
  patternId: string;
  slug: string;
  price: number;
}) {
  const toast = useToast();
  const { format } = useCurrency();
  const [state, formAction, pending] = useActionState<BuyPatternState, FormData>(
    startPatternCheckout,
    {},
  );

  useEffect(() => {
    if (state.error) toast(state.error, "info");
  }, [state, toast]);

  return (
    <form action={formAction}>
      <input type="hidden" name="pattern_id" value={patternId} />
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60 sm:w-auto"
      >
        <Download className="h-4 w-4" />
        {pending ? "Redirecting to checkout…" : `Buy & get the PDF — ${format(price, "USD")}`}
      </button>
      <p className="mt-2 text-xs text-muted">
        Secure payment via Stripe. The PDF is emailed to you instantly — no
        shipping, it&apos;s a digital download.
      </p>
    </form>
  );
}
