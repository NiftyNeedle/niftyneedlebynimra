-- ============================================================
--  Nifty Needle — blog posts (admin-managed)
--  Run once in the Supabase SQL Editor.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.blog_posts (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  excerpt    text not null default '',
  category   text not null default 'Journal',
  content    text not null default '',
  image_url  text,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists blog_posts_created_idx on public.blog_posts (created_at desc);

-- Anyone can read published posts; admin writes via the service key.
alter table public.blog_posts enable row level security;
drop policy if exists "blog public read" on public.blog_posts;
create policy "blog public read" on public.blog_posts
  for select using (published = true);

-- Seed the starter posts (idempotent) so the blog isn't empty; you can
-- edit or delete these from Admin → Blog.
insert into public.blog_posts (slug, title, excerpt, category, content) values
(
  'how-to-care-for-crochet-flowers',
  'How to Care for Your Crochet Flowers',
  $$Everlasting doesn't mean maintenance-free. A few gentle habits keep your handmade blooms looking fresh for years.$$,
  'Crochet Care',
  $$Handmade crochet flowers are designed to last a lifetime, but a little care keeps them looking their best. Unlike fresh flowers, they never wilt — yet dust and sunlight can dull their colours over time.

To clean them, simply use a soft brush or a hairdryer on the cool setting to lift away dust. For deeper cleaning, dab gently with a damp cloth and mild soap, then let air-dry away from direct heat.

Keep your blooms out of prolonged direct sunlight to preserve their vibrancy, and reshape petals with your fingers whenever they need a little fluff.$$
),
(
  'gift-guide-handmade-with-meaning',
  'Gift Guide: Handmade Presents with Meaning',
  $$From new babies to milestone birthdays, here's how to choose a crochet gift that truly resonates.$$,
  'Gift Guides',
  $$The best gifts feel personal — and nothing says 'I made time for you' like something handmade. Custom pieces let you weave in the details that matter, from favourite colours to a hidden monogram.

For new parents, a soft plushie or nursery mobile becomes a keepsake long after the newborn days. For anniversaries, an everlasting bouquet outlasts any fresh arrangement.

When in doubt, a gift set is a beautiful way to combine a few smaller pieces into one thoughtful package — wrapped and ready to give.$$
),
(
  'behind-the-scenes-a-day-in-the-studio',
  'Behind the Scenes: A Day in the Studio',
  $$Ever wondered how your order comes to life? Take a peek inside my little home studio.$$,
  'Behind the Scenes',
  $$Every morning begins with a cup of tea and a look at the day's orders. Each piece is crocheted by hand, one stitch at a time — a process that can take anywhere from a couple of hours to several days.

I choose my yarns carefully, favouring soft, durable cottons that feel as good as they look. Colours are matched by hand to your specifications before a single stitch is made.

Before anything ships, it passes a final quality check and is wrapped in plastic-free packaging. It's slow work — but that's exactly the point.$$
)
on conflict (slug) do nothing;
