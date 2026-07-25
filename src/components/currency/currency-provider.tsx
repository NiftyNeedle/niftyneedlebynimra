"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CURRENCIES, isCurrency } from "@/lib/currency";

interface CurrencyState {
  currency: string;
  setCurrency: (code: string) => void;
  /** Format a USD base amount into the selected currency. */
  format: (amountUsd: number, _ignore?: string) => string;
}

const CurrencyContext = createContext<CurrencyState | null>(null);

export function CurrencyProvider({
  children,
  initialCurrency,
  rates,
}: {
  children: ReactNode;
  initialCurrency: string;
  rates: Record<string, number>;
}) {
  const [currency, setCurrencyState] = useState(
    isCurrency(initialCurrency) ? initialCurrency : "USD",
  );

  const setCurrency = useCallback((code: string) => {
    if (!isCurrency(code)) return;
    setCurrencyState(code);
    try {
      document.cookie = `nn_currency=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
    } catch {
      /* ignore */
    }
  }, []);

  const format = useCallback(
    (amountUsd: number) => {
      const rate = rates[currency] ?? 1;
      const meta = CURRENCIES.find((c) => c.code === currency);
      const digits = meta?.digits ?? 2;
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(amountUsd * rate);
    },
    [currency, rates],
  );

  const value = useMemo(
    () => ({ currency, setCurrency, format }),
    [currency, setCurrency, format],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
