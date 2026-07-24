import { HandHeart, Gem, Clock, Heart } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const values = [
  {
    Icon: HandHeart,
    title: "100% Handmade",
    text: "Every piece is crocheted by hand — never mass-produced.",
  },
  {
    Icon: Gem,
    title: "Lovely Materials",
    text: "Soft, durable yarns chosen with care.",
  },
  {
    Icon: Clock,
    title: "Made to Order",
    text: "Crafted just for you, the moment you order.",
  },
  {
    Icon: Heart,
    title: "A Personal Touch",
    text: "Made one at a time, by hand, with love.",
  },
];

export function About() {
  return (
    <section className="section-px mx-auto max-w-[90rem] py-24" id="about">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Visual collage */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[3/4] rounded-3xl bg-[linear-gradient(135deg,#f3d7d2,#d3a7a1)] shadow-[var(--shadow-soft)]" />
              <div className="mt-10 aspect-[3/4] rounded-3xl bg-[linear-gradient(135deg,#d6e0cb,#8fa57e)] shadow-[var(--shadow-soft)]" />
            </div>
            <div className="glass absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-6 py-4 shadow-[var(--shadow-lift)]">
              <span className="text-3xl">🧶</span>
              <span className="text-sm leading-tight text-muted">
                Every stitch made
                <br />
                by hand, with love
              </span>
            </div>
          </div>
        </Reveal>

        {/* Story */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="My Story"
            title="A little studio, run with a lot of love"
            description="Nifty Needle is a small, one-person crochet studio. It began with a single ball of yarn and a belief that handmade things carry a warmth machines never can. Every order is crocheted by hand — slowly, thoughtfully, and with the same care I'd give a gift for someone I love."
          />

          <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} index={i}>
                <div className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface-muted text-primary">
                    <v.Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h4 className="font-serif text-lg text-foreground">
                      {v.title}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {v.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
