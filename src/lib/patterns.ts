import { createClient } from "@supabase/supabase-js";

/** Public-safe pattern shape — never exposes the private pdf_path. */
export interface Pattern {
  id: string;
  slug: string;
  title: string;
  description: string;
  finishedSize: string;
  difficulty: string;
  price: number;
  isFree: boolean;
  imageUrl?: string;
}

const FALLBACK_SWATCHES = [
  "linear-gradient(135deg,#dde4ee,#8fa57e)",
  "linear-gradient(135deg,#f3d7d2,#c0857e)",
  "linear-gradient(135deg,#e6dac6,#cbb794)",
];

/** A gentle placeholder gradient when a pattern has no cover image yet. */
export function patternSwatch(i: number) {
  return FALLBACK_SWATCHES[i % FALLBACK_SWATCHES.length];
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key) : null;

interface PatternRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  finished_size: string;
  difficulty: string;
  price: number | string;
  is_free: boolean;
  image_url: string | null;
}

const PUBLIC_COLS =
  "id,slug,title,description,finished_size,difficulty,price,is_free,image_url";

function mapRow(r: PatternRow): Pattern {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    finishedSize: r.finished_size ?? "",
    difficulty: r.difficulty ?? "",
    price: Number(r.price) || 0,
    isFree: Boolean(r.is_free),
    imageUrl: r.image_url ?? undefined,
  };
}

export async function getPatterns(): Promise<Pattern[]> {
  if (!db) return [];
  const { data, error } = await db
    .from("patterns")
    .select(PUBLIC_COLS)
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) return []; // table not set up yet
  return (data as PatternRow[]).map(mapRow);
}

export async function getPatternBySlug(slug: string): Promise<Pattern | null> {
  if (!db) return null;
  const { data, error } = await db
    .from("patterns")
    .select(PUBLIC_COLS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error || !data) return null;
  return mapRow(data as PatternRow);
}
