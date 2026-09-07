import type { ProductCustomization } from "./types";
import { customizationFields, optionPrice, visibleFields } from "./customization";

interface PricingInput {
  price: number;
  salePrice?: number | null;
  colors?: string[] | null;
  customizable?: boolean | null;
  customization?: ProductCustomization | null;
}

/**
 * The authoritative unit price for a product with a given set of chosen
 * options — base (or sale) price plus the up-charges the admin defined on
 * the chosen options. Options are keyed by field label, exactly as they
 * are stored on the cart line. Used by BOTH the cart (client) and checkout
 * (server) so the amount shown always equals the amount charged.
 *
 * Only fields the customer can actually see are priced: a nested field
 * whose parent answer doesn't reveal it costs nothing, even if a stale or
 * tampered cart line still carries an answer for it.
 */
export function unitPriceFor(
  product: PricingInput,
  options?: Record<string, string> | null,
): number {
  const base = product.salePrice != null ? product.salePrice : product.price;
  if (!product.customizable || !options) return round2(base);

  let total = base;
  for (const field of visibleFields(customizationFields(product), options)) {
    total += optionPrice(field, options[field.label]);
  }
  return round2(total);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
