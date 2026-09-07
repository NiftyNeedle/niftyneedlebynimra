/**
 * Suggestions for the admin's option-name boxes, chosen by what the
 * field is called: a field named "Rose Colours" offers colour names, a
 * "Size" field offers sizes, a "Yarn" field offers yarn types, and
 * anything else (Flower Type, Pattern, Stem Count…) offers nothing
 * rather than irrelevant noise.
 *
 * Suggestions are only ever a shortcut — any name typed in full is saved
 * exactly as written.
 */

import { COLOR_SUGGESTIONS, type ColorSuggestion } from "./colors";

export interface OptionSuggestion {
  name: string;
  /** Only colours carry a swatch. */
  hex?: string;
}

const SIZE_SUGGESTIONS: OptionSuggestion[] = [
  { name: "Extra Small" },
  { name: "Small" },
  { name: "Medium" },
  { name: "Large" },
  { name: "Extra Large" },
  { name: "Mini" },
  { name: "Standard" },
  { name: "Newborn" },
  { name: "Baby" },
  { name: "Toddler" },
  { name: "Child" },
  { name: "Adult" },
  { name: "One Size" },
];

const YARN_SUGGESTIONS: OptionSuggestion[] = [
  { name: "Premium Cotton" },
  { name: "Organic Cotton" },
  { name: "Recycled Cotton" },
  { name: "Merino Wool" },
  { name: "Lambswool" },
  { name: "Alpaca" },
  { name: "Mohair" },
  { name: "Cashmere Blend" },
  { name: "Bamboo Silk" },
  { name: "Acrylic" },
  { name: "Chenille" },
  { name: "Velvet" },
  { name: "Chunky Wool" },
  { name: "Cotton Cord" },
  { name: "Raffia" },
];

/** Which suggestion set (if any) a field's name asks for. */
export type SuggestionKind = "color" | "size" | "yarn" | "none";

export function suggestionKindFor(fieldLabel: string): SuggestionKind {
  const l = fieldLabel.toLowerCase();
  if (/colou?r|shade|tone|palette/.test(l)) return "color";
  if (/\bsizes?\b|length|height|dimension/.test(l)) return "size";
  if (/yarn|material|fibre|fiber|thread|wool/.test(l)) return "yarn";
  return "none";
}

function setFor(kind: SuggestionKind): OptionSuggestion[] {
  if (kind === "color") return COLOR_SUGGESTIONS as ColorSuggestion[];
  if (kind === "size") return SIZE_SUGGESTIONS;
  if (kind === "yarn") return YARN_SUGGESTIONS;
  return [];
}

/**
 * Suggestions for what the admin has typed so far in a field's option
 * box. Names starting with the query come first, then mid-word matches,
 * alphabetically within each group; exact and already-used names are
 * left out. An unrecognised field name suggests nothing.
 */
export function suggestOptions(
  fieldLabel: string,
  query: string,
  exclude: string[] = [],
  limit = 8,
): OptionSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const pool = setFor(suggestionKindFor(fieldLabel));
  if (!pool.length) return [];

  const taken = new Set(exclude.map((s) => s.trim().toLowerCase()));
  const starts: OptionSuggestion[] = [];
  const contains: OptionSuggestion[] = [];

  for (const s of pool) {
    const name = s.name.toLowerCase();
    if (taken.has(name)) continue;
    // An exact match needs no suggesting.
    if (name === q) continue;
    if (name.startsWith(q)) starts.push(s);
    else if (name.includes(q)) contains.push(s);
  }

  const byName = (a: OptionSuggestion, b: OptionSuggestion) =>
    a.name.localeCompare(b.name);
  return [...starts.sort(byName), ...contains.sort(byName)].slice(0, limit);
}
