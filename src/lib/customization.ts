import type { CustomizationOption } from "./types";

/** Fallback yarn/size choices used when a customizable product hasn't
 *  defined its own. The first entry is treated as the default selection. */
export const DEFAULT_YARN_OPTIONS: CustomizationOption[] = [
  { label: "Premium Cotton", price: 0 },
  { label: "Merino Wool", price: 8 },
  { label: "Bamboo Silk", price: 12 },
];

export const DEFAULT_SIZE_OPTIONS: CustomizationOption[] = [
  { label: "Small", price: 0 },
  { label: "Medium", price: 6 },
  { label: "Large", price: 14 },
];
