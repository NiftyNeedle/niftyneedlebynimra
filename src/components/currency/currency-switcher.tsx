"use client";

import { CURRENCIES } from "@/lib/currency";
import { useCurrency } from "./currency-provider";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className={cn("relative inline-flex", className)}>
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        aria-label="Select currency"
        className="h-10 cursor-pointer rounded-full border border-border bg-transparent px-3 text-sm font-medium text-foreground outline-none transition-colors hover:bg-surface-muted focus:ring-2 focus:ring-ring"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.code}
          </option>
        ))}
      </select>
    </label>
  );
}
