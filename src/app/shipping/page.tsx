import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Shipping options, timescales, and costs for Nifty Needle orders.",
};

export default function ShippingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Delivery"
        title="Shipping information"
        crumbs={[{ label: "Shipping" }]}
      />
      <Prose
        intro="Because every piece is handmade to order, delivery has two parts: production time (while we craft your piece) and shipping time (while it travels to you). We'll always show estimates at checkout."
        sections={[
          {
            heading: "Production time",
            body: [
              "Most ready-to-make items are crafted within 5–12 days. Larger or custom pieces may take a little longer — you'll see an estimate on the product page and at checkout.",
            ],
          },
          {
            heading: "Shipping options & costs",
            body: [
              "Standard shipping (7–12 days) and Express shipping (3–5 days) are available at checkout. Orders over $75 qualify for free standard shipping.",
              "I'm happy to ship internationally. Costs are calculated automatically based on your destination.",
            ],
          },
          {
            heading: "Tracking",
            body: [
              "Once your order ships, you'll receive a tracking number by email and can follow its journey from your account dashboard.",
            ],
          },
          {
            heading: "Customs & duties",
            body: [
              "International orders may be subject to import duties or taxes set by your country. These are the recipient's responsibility and are not included in our prices.",
            ],
          },
        ]}
      />
    </>
  );
}
