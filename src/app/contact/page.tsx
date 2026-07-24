import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, AtSign } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Nifty Needle studio — we'd love to hear from you.",
};

const channels = [
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    value: "+44 7000 000000",
    href: "https://wa.me/447000000000",
  },
  {
    Icon: AtSign,
    label: "Instagram",
    value: "@niftyneedlebynimra",
    href: "https://instagram.com",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "niftyneedlebynimra@gmail.com",
    href: "mailto:niftyneedlebynimra@gmail.com",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Say Hello"
        title="I'd love to hear from you"
        description="Questions about an order, a custom idea, or just want to chat crochet? Message me any way you like — you'll always reach me directly."
        crumbs={[{ label: "Contact" }]}
      />

      <div className="section-px mx-auto max-w-[90rem] py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              {channels.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] transition-colors hover:bg-surface-muted/50"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-muted text-primary">
                    <c.Icon className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-sm text-muted">{c.label}</span>
                    <span className="font-medium text-foreground">
                      {c.value}
                    </span>
                  </span>
                </a>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
              <h3 className="flex items-center gap-2 font-serif text-lg text-foreground">
                <Clock className="h-5 w-5" />
                Business hours
              </h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Mon – Fri</dt>
                  <dd className="text-foreground">9:00 – 18:00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Saturday</dt>
                  <dd className="text-foreground">10:00 – 15:00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Sunday</dt>
                  <dd className="text-foreground">Closed</dd>
                </div>
              </dl>
            </div>

            {/* OpenStreetMap embed */}
            <div className="overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-soft)]">
              <iframe
                title="Studio location"
                className="h-64 w-full"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-0.34,53.72,-0.28,53.76&layer=mapnik"
              />
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </div>
    </>
  );
}
