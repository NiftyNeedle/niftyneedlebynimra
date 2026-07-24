import Link from "next/link";
import { Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Logo } from "./logo";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Crochet Flowers", href: "/shop?category=crochet-flowers" },
      { label: "Bouquets", href: "/shop?category=bouquets" },
      { label: "Plushies", href: "/shop?category=plushies" },
      { label: "Gift Sets", href: "/shop?category=gift-sets" },
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
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Email", href: "mailto:niftyneedlebynimra@gmail.com", Icon: Mail },
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
