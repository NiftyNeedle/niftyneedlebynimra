import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { FaqAccordion, type Faq } from "@/components/faq/faq-accordion";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about ordering handmade crochet from Nifty Needle.",
};

const faqs: Faq[] = [
  {
    q: "How long does it take to make my order?",
    a: "Because everything is handmade to order, most pieces take 5–12 days to craft, plus shipping time. Custom orders may take a little longer — we'll always give you an estimate before you commit.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes! I'm happy to ship internationally with tracking. Shipping is calculated at checkout, and orders over $75 ship free.",
  },
  {
    q: "Can I customise a product?",
    a: "Absolutely. Many products let you choose colours, yarn type, size, and add a personalised name or gift message. For something entirely bespoke, use our Custom Order page.",
  },
  {
    q: "What materials do you use?",
    a: "We use soft, durable, ethically sourced cotton and wool yarns, with hypoallergenic filling for plushies. Material details are listed on each product page.",
  },
  {
    q: "How do I care for my crochet piece?",
    a: "Spot clean with a damp cloth and mild soap, reshape while damp, and air-dry away from direct heat. Avoid machine washing to keep the stitches perfect.",
  },
  {
    q: "What is your return policy?",
    a: "Ready-made items can be returned within 14 days if unused. Custom and personalised pieces are made just for you and can't be returned unless they arrive damaged.",
  },
  {
    q: "How can I track my order?",
    a: "Once your order ships, you'll receive a tracking number by email. You can also track progress anytime from your account dashboard.",
  },
];

export default function FaqsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help Centre"
        title="Frequently asked questions"
        description="Everything you need to know about ordering handmade crochet."
        crumbs={[{ label: "FAQs" }]}
      />
      <div className="section-px mx-auto max-w-3xl py-12">
        <FaqAccordion items={faqs} />
        <div className="mt-10 rounded-3xl bg-surface-muted/60 p-8 text-center">
          <h2 className="font-serif text-2xl text-foreground">
            Still have questions?
          </h2>
          <p className="mt-2 text-muted">
            I&apos;m always happy to help with anything at all.
          </p>
          <ButtonLink href="/contact" className="mt-5">
            Contact us
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
