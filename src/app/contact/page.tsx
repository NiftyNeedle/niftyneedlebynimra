import type { Metadata } from "next";
import type { ComponentType, SVGProps } from "react";
import { Clock, Mail } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import {
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  SOCIALS,
} from "@/components/ui/social-icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Nifty Needle studio — I'd love to hear from you.",
};

const channels: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href: string;
}[] = [
  {
    Icon: WhatsAppIcon,
    label: "WhatsApp",
    value: "+34 641 43 26 54",
    href: SOCIALS.whatsapp,
  },
  {
    Icon: InstagramIcon,
    label: "Instagram",
    value: "@_niftyneedle_",
    href: SOCIALS.instagram,
  },
  {
    Icon: FacebookIcon,
    label: "Facebook",
    value: "Nifty Needle by Nimra",
    href: SOCIALS.facebook,
  },
  {
    Icon: Mail,
    label: "Email",
    value: SOCIALS.email,
    href: `mailto:${SOCIALS.email}`,
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
              <div className="flex items-center gap-1.5 bg-surface px-4 py-2.5 text-sm font-medium text-foreground">
                <span aria-hidden>📍</span> Based in Barcelona, Spain
              </div>
              <iframe
                title="Studio location — Barcelona, Spain"
                className="h-64 w-full"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=2.10%2C41.34%2C2.24%2C41.44&layer=mapnik&marker=41.3888%2C2.159"
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
