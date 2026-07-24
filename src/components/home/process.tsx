import { Search, Palette, ShoppingCart, Hand, BadgeCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { Icon: Search, title: "Browse", text: "Explore collections or start a custom idea." },
  { Icon: Palette, title: "Customize", text: "Pick colours, size, and personal touches." },
  { Icon: ShoppingCart, title: "Place Order", text: "Secure checkout in just a few taps." },
  { Icon: Hand, title: "Handcrafted", text: "We crochet your piece by hand, with love." },
  { Icon: BadgeCheck, title: "Quality Checked", text: "Every stitch inspected before it ships." },
  { Icon: Truck, title: "Delivered", text: "Beautifully packaged and tracked to you." },
];

export function Process() {
  return (
    <section className="bg-brown-deep py-24 text-warm-white">
      <div className="section-px mx-auto max-w-[90rem]">
        <div className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-warm-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-warm-white/80">
            How It Works
          </span>
          <h2 className="max-w-2xl text-balance font-serif text-4xl font-semibold leading-tight md:text-5xl">
            From your idea to your doorstep
          </h2>
          <p className="max-w-2xl text-balance text-warm-white/70">
            A simple, transparent journey — so you always know exactly where your
            handmade piece is.
          </p>
        </div>

        <div className="relative grid gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-warm-white/15 lg:block" />
          {steps.map((s, i) => (
            <Reveal key={s.title} index={i} className="relative">
              <div className="flex flex-col items-center text-center">
                <span className="relative z-10 grid h-16 w-16 place-items-center rounded-2xl bg-warm-white text-primary shadow-[var(--shadow-lift)]">
                  <s.Icon className="h-7 w-7" />
                  <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-accent text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <h4 className="mt-5 font-serif text-xl">{s.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-warm-white/70">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
