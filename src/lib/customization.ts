import {
  ALL_CUSTOMIZATION,
  type CustomizationField,
  type CustomizationFieldType,
  type CustomizationOption,
  type ProductCustomization,
} from "./types";

/** Fallback yarn/size choices for products saved before the dynamic
 *  editor, which could enable yarn/size without listing any choices. */
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

export const CUSTOMIZATION_FIELD_TYPES: {
  value: CustomizationFieldType;
  label: string;
  hint: string;
}[] = [
  { value: "choice", label: "Choices", hint: "Customer picks one option" },
  { value: "text", label: "Short text", hint: "One-line answer" },
  { value: "note", label: "Long text", hint: "A few lines" },
];

/** "Flower Type" → "flower-type". Stable id for a field. */
export function fieldId(label: string) {
  return (
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "field"
  );
}

/** Handy starting points in the admin editor — the admin can rename,
 *  re-price or delete any of them; nothing here is enforced. */
export const FIELD_PRESETS: {
  label: string;
  type: CustomizationFieldType;
  options?: CustomizationOption[];
  placeholder?: string;
}[] = [
  { label: "Colour", type: "choice", options: [{ label: "", price: 0 }] },
  { label: "Size", type: "choice", options: DEFAULT_SIZE_OPTIONS },
  { label: "Yarn", type: "choice", options: DEFAULT_YARN_OPTIONS },
  { label: "Name", type: "text", placeholder: "e.g. Emma" },
  {
    label: "Gift Message",
    type: "note",
    placeholder: "A little note to include…",
  },
  {
    label: "Special Instructions",
    type: "note",
    placeholder: "Any special requests?",
  },
];

interface FieldSource {
  customizable?: boolean | null;
  customization?: ProductCustomization | null;
  colors?: string[] | null;
}

/**
 * The customization fields a product actually offers.
 *
 * Products saved with the dynamic editor carry `customization.fields`.
 * Older rows carry the fixed colour/yarn/size flags and are converted
 * here, using the same labels the old storefront used as cart keys — so
 * existing products, carts and orders keep pricing correctly.
 *
 * Shared by the storefront, the cart and the checkout re-pricing so all
 * three always agree on what a product offers.
 */
export function customizationFields(product: FieldSource): CustomizationField[] {
  if (!product.customizable) return [];
  const cz = product.customization ?? ALL_CUSTOMIZATION;

  // An explicit `fields` array — even an empty one — means the product was
  // saved with the dynamic editor, so it is the whole truth. Only rows
  // without it fall back to the pre-dynamic colour/yarn/size flags.
  if (Array.isArray(cz.fields)) {
    return cz.fields
      .filter((f) => f && f.label && f.type)
      .map((f) => ({
        ...f,
        id: f.id || fieldId(f.label),
        options: f.type === "choice" ? f.options ?? [] : undefined,
      }))
      .filter((f) => f.type !== "choice" || (f.options?.length ?? 0) > 0);
  }

  return legacyFields(cz, product.colors ?? []);
}

function legacyFields(
  cz: ProductCustomization,
  colors: string[],
): CustomizationField[] {
  const fields: CustomizationField[] = [];
  const push = (
    label: string,
    type: CustomizationFieldType,
    extra: Partial<CustomizationField> = {},
  ) => fields.push({ id: fieldId(label), label, type, ...extra });

  if (cz.color) {
    const options = cz.colorOptions?.length
      ? cz.colorOptions
      : colors.map((c) => ({ label: c, price: 0 }));
    if (options.length) push("Colour", "choice", { options });
  }
  if (cz.yarn) {
    push("Yarn", "choice", {
      options: cz.yarnOptions?.length ? cz.yarnOptions : DEFAULT_YARN_OPTIONS,
    });
  }
  if (cz.size) {
    push("Size", "choice", {
      options: cz.sizeOptions?.length ? cz.sizeOptions : DEFAULT_SIZE_OPTIONS,
    });
  }
  if (cz.name) push("Name", "text", { placeholder: "e.g. Emma" });
  if (cz.giftMessage) {
    push("Gift Message", "note", { placeholder: "A little note to include…" });
  }
  if (cz.instructions) {
    push("Special Instructions", "note", {
      placeholder: "Any special requests?",
    });
  }
  return fields;
}

/** The up-charge for one chosen value of a field (0 for text fields). */
export function optionPrice(
  field: CustomizationField,
  chosen: string | undefined,
): number {
  if (field.type !== "choice" || !chosen) return 0;
  return field.options?.find((o) => o.label === chosen)?.price ?? 0;
}

/* ────────────────────────────────────────────────────────────────────
   Admin editor drafts. A draft keeps its prices as STRINGS so a price
   box can genuinely be emptied while typing; an empty (or unparseable)
   box means "no extra charge" and saves as 0.
   ──────────────────────────────────────────────────────────────────── */

export interface DraftOption {
  label: string;
  price: string;
}

export interface DraftField {
  /** React key only — survives renames, never saved. */
  key: string;
  label: string;
  type: CustomizationFieldType;
  placeholder: string;
  required: boolean;
  options: DraftOption[];
}

let draftKeySeq = 0;
export const nextDraftKey = () => `czf-${++draftKeySeq}`;

/** Price as the admin should see it: free options show an empty box. */
export function priceToText(price: number | undefined) {
  return price ? String(price) : "";
}

/** Price as stored: an empty or invalid box is 0, and never negative. */
export function priceFromText(text: string) {
  return Math.max(0, Number(text) || 0);
}

export function draftFromField(f: CustomizationField): DraftField {
  return {
    key: nextDraftKey(),
    label: f.label,
    type: f.type,
    placeholder: f.placeholder ?? "",
    required: Boolean(f.required),
    options: (f.options ?? []).map((o) => ({
      label: o.label,
      price: priceToText(o.price),
    })),
  };
}

export function draftFromPreset(
  preset?: (typeof FIELD_PRESETS)[number],
): DraftField {
  return {
    key: nextDraftKey(),
    label: preset?.label ?? "",
    type: preset?.type ?? "choice",
    placeholder: preset?.placeholder ?? "",
    required: false,
    options: (preset?.options ?? [{ label: "", price: 0 }]).map((o) => ({
      label: o.label,
      price: priceToText(o.price),
    })),
  };
}

export function fieldFromDraft(f: DraftField): CustomizationField {
  const label = f.label.trim();
  const field: CustomizationField = { id: fieldId(label), label, type: f.type };
  if (f.type === "choice") {
    field.options = f.options
      .filter((o) => o.label.trim())
      .map((o) => ({ label: o.label.trim(), price: priceFromText(o.price) }));
  } else {
    if (f.placeholder.trim()) field.placeholder = f.placeholder.trim();
    if (f.required) field.required = true;
  }
  return field;
}

/** A field needs a label, and a choice field needs at least one choice. */
export function isUsableField(f: CustomizationField) {
  return Boolean(f.label) && (f.type !== "choice" || (f.options?.length ?? 0) > 0);
}
