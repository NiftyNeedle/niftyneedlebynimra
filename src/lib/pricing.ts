import { ALL_CUSTOMIZATION, type ProductCustomization } from "./types";
import { DEFAULT_YARN_OPTIONS, DEFAULT_SIZE_OPTIONS } from "./customization";

interface PricingInput {
  price: number;
  salePrice?: number | null;
  colors?: string[] | null;
  customizable?: boolean | null;
  customization?: ProductCustomization | null;
}

/**
 * The authoritative unit price for a product with a given set of chosen
 * options — base (or sale) price plus any per-option up-charges the admin
 * defined. Used by BOTH the cart (client) and checkout (server) so the
 * amount shown always equals the amount charged.
 */
export function unitPriceFor(
  product: PricingInput,
  options?: Record<string, string> | null,
): number {
  const base = product.salePrice != null ? product.salePrice : product.price;
  if (!product.customizable || !options) return round2(base);

  const cz = product.customization ?? ALL_CUSTOMIZATION;
  const colorTypes =
    cz.colorOptions && cz.colorOptions.length
      ? cz.colorOptions
      : (product.colors ?? []).map((c) => ({ label: c, price: 0 }));
  const yarnTypes =
    cz.yarnOptions && cz.yarnOptions.length ? cz.yarnOptions : DEFAULT_YARN_OPTIONS;
  const sizeTypes =
    cz.sizeOptions && cz.sizeOptions.length ? cz.sizeOptions : DEFAULT_SIZE_OPTIONS;

  let total = base;
  if (cz.color && options.Colour)
    total += colorTypes.find((o) => o.label === options.Colour)?.price ?? 0;
  if (cz.yarn && options.Yarn)
    total += yarnTypes.find((o) => o.label === options.Yarn)?.price ?? 0;
  if (cz.size && options.Size)
    total += sizeTypes.find((o) => o.label === options.Size)?.price ?? 0;

  return round2(total);
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
