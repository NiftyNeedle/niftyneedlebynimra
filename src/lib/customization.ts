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
    const fields = cz.fields
      .filter((f) => f && f.label && f.type)
      .map((f) => ({
        ...f,
        id: f.id || fieldId(f.label),
        options: f.type === "choice" ? f.options ?? [] : undefined,
      }))
      .filter((f) => f.type !== "choice" || (f.options?.length ?? 0) > 0);

    // Drop a dependency that points at nothing usable, so a field never
    // becomes permanently invisible because its parent was deleted.
    const ids = new Set(fields.map((f) => f.id));
    return fields.map((f) =>
      f.showWhen &&
      (!ids.has(f.showWhen.fieldId) || !f.showWhen.values?.length)
        ? { ...f, showWhen: undefined }
        : f,
    );
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

/**
 * The fields a customer should actually see right now: a nested field
 * appears only when its parent field is itself visible AND answered with
 * one of the values it depends on. Parents always precede their children,
 * so one pass in order is enough (and chains like
 * Flower → Rose Colour → Rose Shade work).
 *
 * `answers` is keyed by field label, exactly like a cart line's options.
 * Used for rendering, pricing and validation so a hidden field is never
 * charged for and never lands on the order.
 */
export function visibleFields(
  fields: CustomizationField[],
  answers: Record<string, string>,
): CustomizationField[] {
  const shown = new Map<string, CustomizationField>();
  const out: CustomizationField[] = [];

  for (const field of fields) {
    const dep = field.showWhen;
    if (!dep) {
      shown.set(field.id, field);
      out.push(field);
      continue;
    }
    const parent = shown.get(dep.fieldId);
    // Parent missing or hidden → this field stays hidden too.
    if (!parent) continue;
    if (dep.values.includes(answers[parent.label] ?? "")) {
      shown.set(field.id, field);
      out.push(field);
    }
  }

  return out;
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
  /** Nesting, tracked by the parent's draft `key` rather than its id, so
   *  renaming a parent can't quietly break the link. "" = always shown. */
  showWhenKey: string;
  /** Parent answers that reveal this field. */
  showWhenValues: string[];
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

function draftFromField(f: CustomizationField): DraftField {
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
    // Filled in by draftsFromFields, which can map ids → draft keys.
    showWhenKey: "",
    showWhenValues: [],
  };
}

/** Saved fields → editor drafts, translating parent ids to draft keys. */
export function draftsFromFields(fields: CustomizationField[]): DraftField[] {
  const drafts = fields.map(draftFromField);
  const keyById = new Map(fields.map((f, i) => [f.id, drafts[i].key]));
  fields.forEach((f, i) => {
    const parentKey = f.showWhen && keyById.get(f.showWhen.fieldId);
    if (parentKey) {
      drafts[i].showWhenKey = parentKey;
      drafts[i].showWhenValues = [...(f.showWhen?.values ?? [])];
    }
  });
  return drafts;
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
    showWhenKey: "",
    showWhenValues: [],
  };
}

function fieldFromDraft(f: DraftField): CustomizationField {
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

/**
 * Editor drafts → fields to save. Unusable drafts are dropped, then each
 * dependency is resolved from the parent's draft key to its saved id —
 * keeping only parents that survived, sit EARLIER in the list (so nesting
 * can never loop) and still offer the values depended on.
 */
export function fieldsFromDrafts(drafts: DraftField[]): CustomizationField[] {
  const kept = drafts.filter((d) => isUsableField(fieldFromDraft(d)));
  const fields = kept.map(fieldFromDraft);
  const indexByKey = new Map(kept.map((d, i) => [d.key, i]));

  return fields.map((field, i) => {
    const draft = kept[i];
    const parentIndex = indexByKey.get(draft.showWhenKey);
    if (parentIndex === undefined || parentIndex >= i) return field;

    const parent = fields[parentIndex];
    if (parent.type !== "choice") return field;

    const allowed = new Set(parent.options?.map((o) => o.label));
    const values = draft.showWhenValues.filter((v) => allowed.has(v));
    if (!values.length) return field;

    return { ...field, showWhen: { fieldId: parent.id, values } };
  });
}
