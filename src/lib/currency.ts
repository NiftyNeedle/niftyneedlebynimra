export interface CurrencyMeta {
  code: string;
  name: string;
  digits: number;
}

/** Supported display currencies (base is USD). */
export const CURRENCIES: CurrencyMeta[] = [
  { code: "USD", name: "US Dollar", digits: 2 },
  { code: "GBP", name: "British Pound", digits: 2 },
  { code: "EUR", name: "Euro", digits: 2 },
  { code: "CAD", name: "Canadian Dollar", digits: 2 },
  { code: "AUD", name: "Australian Dollar", digits: 2 },
  { code: "AED", name: "UAE Dirham", digits: 2 },
  { code: "PKR", name: "Pakistani Rupee", digits: 0 },
  { code: "INR", name: "Indian Rupee", digits: 0 },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export function isCurrency(code: string | undefined | null): code is string {
  return Boolean(code && CURRENCY_CODES.includes(code));
}

/** Approximate rates vs USD — used if the live API is unavailable. */
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  AUD: 1.52,
  AED: 3.67,
  PKR: 278,
  INR: 83,
};

/** Country (ISO-2) → currency. Anything unlisted falls back to USD. */
const COUNTRY_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  AE: "AED",
  PK: "PKR",
  IN: "INR",
  // Eurozone
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", IE: "EUR",
  PT: "EUR", BE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR",
  SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR",
  MT: "EUR", HR: "EUR",
};

export function currencyForCountry(country: string | null | undefined): string {
  if (!country) return "USD";
  return COUNTRY_CURRENCY[country.toUpperCase()] ?? "USD";
}

/** Live USD-based rates for our currencies, cached for 12h. Falls back safely. */
export async function getRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 43200 },
    });
    if (!res.ok) return FALLBACK_RATES;
    const data = await res.json();
    const r = data?.rates as Record<string, number> | undefined;
    if (!r) return FALLBACK_RATES;
    const out: Record<string, number> = {};
    for (const code of CURRENCY_CODES) {
      out[code] = typeof r[code] === "number" ? r[code] : FALLBACK_RATES[code];
    }
    return out;
  } catch {
    return FALLBACK_RATES;
  }
}
