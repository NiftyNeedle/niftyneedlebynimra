import Link from "next/link";
import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const designs = [
  {
    id: "d1",
    name: "Custom pet plushie — 'Mochi'",
    note: "Grey tabby, green collar, ~18cm",
    swatch: "linear-gradient(135deg,#e6dac6,#cbb794,#9c7f5a)",
  },
  {
    id: "d2",
    name: "Wedding bouquet — sage & blush",
    note: "12 stems, ivory ribbon wrap",
    swatch: "linear-gradient(135deg,#d6e0cb,#8fa57e,#d3a7a1)",
  },
];

export default function DesignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Saved designs</h2>
        <ButtonLink href="/custom" size="sm">
          <Sparkles className="h-4 w-4" />
          New custom order
        </ButtonLink>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {designs.map((d) => (
          <div
            key={d.id}
            className="flex gap-4 rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
          >
            <span
              className="h-20 w-20 shrink-0 rounded-2xl"
              style={{ background: d.swatch }}
            />
            <div className="flex flex-col">
              <p className="font-serif text-lg text-foreground">{d.name}</p>
              <p className="mt-1 text-sm text-muted">{d.note}</p>
              <Link
                href="/custom"
                className="mt-auto text-sm font-medium text-accent hover:underline"
              >
                Reorder / edit →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
