/**
 * Colour name suggestions for the admin's customization editor, so a
 * colour list can be typed a couple of letters at a time instead of in
 * full. Purely an admin convenience — nothing here constrains what the
 * admin can save; any name typed in full is kept as-is.
 */

export interface ColorSuggestion {
  name: string;
  /** Swatch shown beside the name in the dropdown. */
  hex: string;
}

/** Yarn-ish colours, roughly grouped by family. */
export const COLOR_SUGGESTIONS: ColorSuggestion[] = [
  // Neutrals
  { name: "White", hex: "#ffffff" },
  { name: "Off White", hex: "#f7f3ec" },
  { name: "Ivory", hex: "#fffff0" },
  { name: "Cream", hex: "#f5e9d7" },
  { name: "Beige", hex: "#e8d9bf" },
  { name: "Sand", hex: "#dcc9a6" },
  { name: "Oatmeal", hex: "#ddd3c0" },
  { name: "Taupe", hex: "#b09b85" },
  { name: "Grey", hex: "#9aa0a6" },
  { name: "Light Grey", hex: "#d3d6da" },
  { name: "Charcoal", hex: "#4a4f55" },
  { name: "Black", hex: "#1c1c1c" },
  // Pinks / reds
  { name: "Blush", hex: "#f3d7d2" },
  { name: "Baby Pink", hex: "#f7cfd8" },
  { name: "Pink", hex: "#f39ab5" },
  { name: "Hot Pink", hex: "#e8467c" },
  { name: "Dusty Rose", hex: "#c98b93" },
  { name: "Rose", hex: "#d75f77" },
  { name: "Coral", hex: "#f78a6c" },
  { name: "Peach", hex: "#f9c9a8" },
  { name: "Salmon", hex: "#f2917c" },
  { name: "Red", hex: "#d1352b" },
  { name: "Cherry Red", hex: "#b3202c" },
  { name: "Burgundy", hex: "#6e1b2b" },
  { name: "Maroon", hex: "#7b2b2b" },
  { name: "Wine", hex: "#5e2233" },
  { name: "Terracotta", hex: "#c46a4f" },
  { name: "Rust", hex: "#a8502a" },
  // Oranges / yellows
  { name: "Orange", hex: "#ef7d22" },
  { name: "Burnt Orange", hex: "#c05a1c" },
  { name: "Apricot", hex: "#f6b26b" },
  { name: "Mustard", hex: "#d8a02b" },
  { name: "Gold", hex: "#d4af37" },
  { name: "Yellow", hex: "#f3cf3f" },
  { name: "Lemon", hex: "#f7e474" },
  { name: "Butter", hex: "#f5e6a8" },
  // Greens
  { name: "Sage", hex: "#a7b899" },
  { name: "Mint", hex: "#b7e4cd" },
  { name: "Pistachio", hex: "#bcd39a" },
  { name: "Olive", hex: "#7a7f45" },
  { name: "Moss", hex: "#6b7a4a" },
  { name: "Green", hex: "#3f8f5c" },
  { name: "Emerald", hex: "#1f7a5a" },
  { name: "Forest Green", hex: "#2c4b34" },
  { name: "Teal", hex: "#2b7f83" },
  // Blues / purples
  { name: "Sky Blue", hex: "#a9d3ec" },
  { name: "Light Blue", hex: "#bcd9ee" },
  { name: "Powder Blue", hex: "#c6d8e6" },
  { name: "Denim", hex: "#5471a3" },
  { name: "Blue", hex: "#2f66a6" },
  { name: "Royal Blue", hex: "#22409a" },
  { name: "Navy", hex: "#1b2a49" },
  { name: "Turquoise", hex: "#3fb8b0" },
  { name: "Lilac", hex: "#c8b6e2" },
  { name: "Lavender", hex: "#bfa9d9" },
  { name: "Purple", hex: "#7a4fa3" },
  { name: "Plum", hex: "#6b3050" },
  { name: "Mauve", hex: "#b189a1" },
  // Browns
  { name: "Camel", hex: "#c19a6b" },
  { name: "Caramel", hex: "#b57c46" },
  { name: "Honey", hex: "#d9a256" },
  { name: "Tan", hex: "#c8a37a" },
  { name: "Brown", hex: "#7b5233" },
  { name: "Chocolate", hex: "#4f3122" },
  { name: "Espresso", hex: "#3a2a22" },
  // Metallics / specials
  { name: "Silver", hex: "#c8ccd0" },
  { name: "Rose Gold", hex: "#dfa3a0" },
  { name: "Multicolour", hex: "#c0857e" },
  { name: "Rainbow", hex: "#8fa57e" },
  { name: "Natural", hex: "#e3d5bd" },
];

/**
 * Colours matching what the admin has typed so far. Names starting with
 * the query come first (typing "ro" offers Rose before Terracotta), then
 * mid-word matches; colours already used in the same list are left out.
 */
export function suggestColors(
  query: string,
  exclude: string[] = [],
  limit = 8,
): ColorSuggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const taken = new Set(exclude.map((s) => s.trim().toLowerCase()));
  const starts: ColorSuggestion[] = [];
  const contains: ColorSuggestion[] = [];

  for (const c of COLOR_SUGGESTIONS) {
    const name = c.name.toLowerCase();
    if (taken.has(name)) continue;
    // An exact match needs no suggesting.
    if (name === q) continue;
    if (name.startsWith(q)) starts.push(c);
    else if (name.includes(q)) contains.push(c);
  }

  // Alphabetical within each group, so the same few letters always offer
  // the same list in the same order.
  const byName = (a: ColorSuggestion, b: ColorSuggestion) =>
    a.name.localeCompare(b.name);
  return [...starts.sort(byName), ...contains.sort(byName)].slice(0, limit);
}
