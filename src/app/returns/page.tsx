import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Returns",
  description: "Our returns and refunds policy for handmade crochet orders.",
};

export default function ReturnsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Peace of Mind"
        title="Returns & refunds"
        crumbs={[{ label: "Returns" }]}
      />
      <Prose
        intro="We want you to love your handmade piece. If something isn't right, here's how we'll make it right."
        sections={[
          {
            heading: "Ready-made items",
            body: [
              "Non-personalised, ready-made items can be returned within 14 days of delivery, provided they're unused and in their original condition. Return shipping is the customer's responsibility unless the item arrived faulty.",
            ],
          },
          {
            heading: "Custom & personalised items",
            body: [
              "Because custom and personalised pieces are made just for you, they can't be returned or refunded unless they arrive damaged or defective.",
            ],
          },
          {
            heading: "Damaged or faulty items",
            body: [
              "If your order arrives damaged, please email us within 7 days with photos. We'll arrange a repair, replacement, or full refund at no cost to you.",
            ],
          },
          {
            heading: "How to start a return",
            body: [
              "Contact us at niftyneedlebynimra@gmail.com or through your account dashboard with your order number, and we'll guide you through the next steps.",
            ],
          },
        ]}
      />
    </>
  );
}
