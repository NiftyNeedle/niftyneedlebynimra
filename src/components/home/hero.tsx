"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gift, Hand, Heart, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const floaties = [
  { emoji: "🌸", className: "left-[8%] top-[22%]", delay: 0 },
  { emoji: "🧶", className: "right-[10%] top-[16%]", delay: 1.2 },
  { emoji: "🌷", className: "left-[14%] bottom-[16%]", delay: 0.6 },
  { emoji: "🧸", className: "right-[16%] bottom-[20%]", delay: 1.8 },
  { emoji: "💐", className: "right-[30%] top-[8%]", delay: 2.2 },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft gradient wash */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-pink/25 blur-3xl" />
        <div className="absolute -right-40 top-20 h-[34rem] w-[34rem] rounded-full bg-sage/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-brown/20 blur-3xl" />
      </div>

      {/* Floating crochet elements */}
      {floaties.map((f, i) => (
        <motion.span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute hidden text-4xl md:block lg:text-5xl ${f.className}`}
          animate={{ y: [0, -22, 0], rotate: [0, 6, 0] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: f.delay,
          }}
        >
          {f.emoji}
        </motion.span>
      ))}

      <div className="section-px mx-auto flex max-w-[90rem] flex-col items-center py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-foreground/80"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          Handmade to order, just for you
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-7 max-w-4xl text-balance font-serif text-5xl font-semibold leading-[1.05] text-foreground md:text-7xl"
        >
          Handcrafted Crochet{" "}
          <span className="text-gradient">Made with Love</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted"
        >
          Every stitch tells a story. Discover handmade crochet flowers,
          bouquets, plushies, gifts, home décor, and fully customized creations
          crafted especially for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ButtonLink href="/shop" size="lg" className="group">
            Shop Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </ButtonLink>
          <ButtonLink href="/custom" size="lg" variant="outline">
            Customize Your Own
          </ButtonLink>
          <ButtonLink href="/shop" size="lg" variant="outline">
            Explore Collection
          </ButtonLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted"
        >
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-accent" />
            Handmade with love
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="flex items-center gap-1.5">
            <Hand className="h-4 w-4 text-accent" />
            100% handmade
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" />
          <span className="flex items-center gap-1.5">
            <Gift className="h-4 w-4 text-accent" />
            Made just for you
          </span>
        </motion.div>
      </div>
    </section>
  );
}
