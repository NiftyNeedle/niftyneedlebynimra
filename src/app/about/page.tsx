import type { Metadata } from "next";
import { Gem, HandHeart, Heart, Palette, Recycle, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Nifty Needle — a small, one-person handmade crochet studio.",
};

const values = [
  { Icon: HandHeart, title: "Made with love", text: "Every piece is crocheted by hand, never mass-produced." },
  { Icon: Gem, title: "Lovely materials", text: "Soft, durable yarns chosen with care." },
  { Icon: Sparkles, title: "Made to order", text: "Crafted just for you, the moment you order." },
  { Icon: Palette, title: "Custom designs", text: "Your colours, your size, your idea." },
  { Icon: Heart, title: "A personal touch", text: "Made one at a time, by hand." },
  { Icon: Recycle, title: "Built to last", text: "Heirloom quality that outlives trends." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="My Story"
        title="A little studio, run with a lot of love"
        description="Nifty Needle is a small, one-person crochet studio, born from a belief that handmade things carry a warmth machines never can."
        crumbs={[{ label: "About" }]}
      />

      <div className="section-px mx-auto max-w-[90rem] py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-3xl bg-[linear-gradient(135deg,#f3d7d2,#d3a7a1)]" />
              <div className="mt-10 aspect-[3/4] rounded-3xl bg-[linear-gradient(135deg,#d6e0cb,#8fa57e)]" />
            </div>
          </Reveal>
          <div>
            <h2 className="font-serif text-3xl font-semibold text-foreground">
              How it started
            </h2>
            <div className="mt-4 space-y-4 text-muted">
              <p>
                What began as a quiet hobby quickly became a calling. Friends
                asked me for a bouquet that would never wilt, a plushie for a
                new baby, a keepsake for a wedding — and each request became a
                small labour of love.
              </p>
              <p>
                Nifty Needle is still very much a home studio — just me, my
                yarn, and a lot of patience. Every order is crocheted by hand,
                one stitch at a time, with the same care I&apos;d give a gift
                for someone I love. Slow, thoughtful making is worth it — and
                you&apos;ll feel it the moment you unwrap yours.
              </p>
            </div>
            <ButtonLink href="/custom" className="mt-6">
              Start a custom order
            </ButtonLink>
          </div>
        </div>

        {/* Meet the maker */}
        <div className="mt-20 flex flex-col items-center gap-6 rounded-[2rem] bg-brown-deep p-8 text-center text-warm-white md:flex-row md:p-12 md:text-left">
          <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-warm-white/15 font-serif text-3xl font-semibold">
            NH
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warm-white/70">
              Meet the maker
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Hi there
            </h2>
            <p className="mt-3 max-w-2xl text-warm-white/80">
              I&apos;m Nimra Huda, and I design and crochet every Nifty Needle
              piece myself, from my home studio. When you order, you&apos;re not
              buying from a factory — you&apos;re commissioning something made
              just for you, by hand. Thank you for supporting a small, handmade
              business.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-foreground">
            What I care about
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} index={i % 3}>
                <div className="flex h-full gap-4 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-muted text-primary">
                    <v.Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-foreground">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{v.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
