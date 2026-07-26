import { createClient } from "@supabase/supabase-js";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readMinutes: number;
  imageUrl?: string;
  swatch: string;
  content: string[];
}

const FALLBACK_SWATCHES = [
  "linear-gradient(135deg,#f3d7d2,#d3a7a1,#8fa57e)",
  "linear-gradient(135deg,#e6dac6,#cbb794,#c0857e)",
  "linear-gradient(135deg,#d6e0cb,#8fa57e,#6e8560)",
];

/** Built-in starter posts — used only if the blog table isn't set up. */
export const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: "how-to-care-for-crochet-flowers",
    title: "How to Care for Your Crochet Flowers",
    excerpt:
      "Everlasting doesn't mean maintenance-free. A few gentle habits keep your handmade blooms looking fresh for years.",
    category: "Crochet Care",
    author: "The Nifty Needle Studio",
    date: "2026-06-18",
    readMinutes: 4,
    swatch: FALLBACK_SWATCHES[0],
    content: [
      "Handmade crochet flowers are designed to last a lifetime, but a little care keeps them looking their best. Unlike fresh flowers, they never wilt — yet dust and sunlight can dull their colours over time.",
      "To clean them, simply use a soft brush or a hairdryer on the cool setting to lift away dust. For deeper cleaning, dab gently with a damp cloth and mild soap, then let air-dry away from direct heat.",
      "Keep your blooms out of prolonged direct sunlight to preserve their vibrancy, and reshape petals with your fingers whenever they need a little fluff.",
    ],
  },
  {
    slug: "gift-guide-handmade-with-meaning",
    title: "Gift Guide: Handmade Presents with Meaning",
    excerpt:
      "From new babies to milestone birthdays, here's how to choose a crochet gift that truly resonates.",
    category: "Gift Guides",
    author: "The Nifty Needle Studio",
    date: "2026-06-05",
    readMinutes: 6,
    swatch: FALLBACK_SWATCHES[1],
    content: [
      "The best gifts feel personal — and nothing says 'I made time for you' like something handmade. Custom pieces let you weave in the details that matter, from favourite colours to a hidden monogram.",
      "For new parents, a soft plushie or nursery mobile becomes a keepsake long after the newborn days. For anniversaries, an everlasting bouquet outlasts any fresh arrangement.",
      "When in doubt, a gift set is a beautiful way to combine a few smaller pieces into one thoughtful package — wrapped and ready to give.",
    ],
  },
  {
    slug: "behind-the-scenes-a-day-in-the-studio",
    title: "Behind the Scenes: A Day in the Studio",
    excerpt:
      "Ever wondered how your order comes to life? Take a peek inside our little home studio.",
    category: "Behind the Scenes",
    author: "The Nifty Needle Studio",
    date: "2026-05-20",
    readMinutes: 5,
    swatch: FALLBACK_SWATCHES[2],
    content: [
      "Every morning begins with a cup of tea and a look at the day's orders. Each piece is crocheted by hand, one stitch at a time — a process that can take anywhere from a couple of hours to several days.",
      "We choose our yarns carefully, favouring soft, durable cottons that feel as good as they look. Colours are matched by hand to your specifications before a single stitch is made.",
      "Before anything ships, it passes a final quality check and is wrapped in our plastic-free packaging. It's slow work — but that's exactly the point.",
    ],
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key) : null;

interface BlogRow {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

function mapRow(r: BlogRow, i = 0): BlogPost {
  const paragraphs = String(r.content ?? "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category,
    author: "The Nifty Needle Studio",
    date: new Date(r.created_at).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    readMinutes: Math.max(1, Math.round(words / 200)),
    imageUrl: r.image_url ?? undefined,
    swatch: FALLBACK_SWATCHES[i % FALLBACK_SWATCHES.length],
    content: paragraphs,
  };
}

export async function getPosts(): Promise<BlogPost[]> {
  if (!db) return FALLBACK_POSTS;
  const { data, error } = await db
    .from("blog_posts")
    .select("slug,title,excerpt,category,content,image_url,created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) return FALLBACK_POSTS; // table not set up yet
  return (data as BlogRow[]).map((r, i) => mapRow(r, i));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!db) return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
  const { data, error } = await db
    .from("blog_posts")
    .select("slug,title,excerpt,category,content,image_url,created_at")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
  return data ? mapRow(data as BlogRow) : null;
}
