import Link from "next/link";
import { Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Logo } from "./logo";
import {
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  SOCIALS,
} from "@/components/ui/social-icons";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Crochet Patterns", href: "/patterns" },
      { label: "Crochet Flowers", href: "/shop?category=crochet-flowers" },
      { label: "Bouquets", href: "/shop?category=bouquets" },
      { label: "Plushies", href: "/shop?category=plushies" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Custom Orders", href: "/custom" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Order Tracking", href: "/track" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

const socials: {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { label: "Instagram", href: SOCIALS.instagram, Icon: InstagramIcon },
  { label: "Facebook", href: SOCIALS.facebook, Icon: FacebookIcon },
  { label: "WhatsApp", href: SOCIALS.whatsapp, Icon: WhatsAppIcon },
  { label: "Email", href: `mailto:${SOCIALS.email}`, Icon: Mail },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-muted">
      <div className="section-px mx-auto max-w-[90rem] py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">
              A little one-person crochet studio. Every stitch tells a story —
              from everlasting bouquets to one-of-a-kind custom creations, all
              handmade to order.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-lg text-foreground">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Nifty Needle. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Handmade with
            <span className="text-accent">♥</span>
by hand.
          </p>
        </div>
      </div>
    </footer>
  );
}
