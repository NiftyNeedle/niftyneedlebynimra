import {
  Hand,
  Sparkles,
  Palette,
  Truck,
  Gift,
  ShieldCheck,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const reasons = [
  { Icon: Hand, title: "100% Handmade", text: "Crocheted stitch by stitch, never machine-made." },
  { Icon: Sparkles, title: "Lovely Yarn", text: "Soft, lasting fibres chosen with care." },
  { Icon: Palette, title: "Custom Designs", text: "Your colours, your size, your idea." },
  { Icon: Truck, title: "Careful Shipping", text: "Packed with care and sent with tracking." },
  { Icon: Gift, title: "Gift Packaging", text: "Beautifully wrapped, ready to give." },
  { Icon: ShieldCheck, title: "Secure Payments", text: "Encrypted checkout you can trust." },
  { Icon: Heart, title: "Made with Love", text: "Every order treated as a keepsake." },
  { Icon: MessageCircle, title: "A Personal Reply", text: "You're chatting directly with the maker." },
];

export function WhyChooseUs() {
  return (
    <section className="section-px mx-auto max-w-[90rem] py-24">
      <SectionHeading
        eyebrow="Why Nifty Needle"
        title="Little details, thoughtfully done"
        description="The care that goes into every stitch is the same care that shapes your whole experience with us."
        className="mx-auto mb-14"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {reasons.map((r, i) => (
          <Reveal key={r.title} index={i % 4}>
            <div className="group flex h-full flex-col gap-4 rounded-3xl border border-border bg-surface p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-muted text-primary transition-colors duration-500 group-hover:bg-primary group-hover:text-primary-foreground">
                <r.Icon className="h-6 w-6" />
              </span>
              <div>
                <h4 className="font-serif text-lg text-foreground">{r.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {r.text}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
