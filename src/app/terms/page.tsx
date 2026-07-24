import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions for using the Nifty Needle website and services.",
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="Terms & Conditions"
        crumbs={[{ label: "Terms & Conditions" }]}
      />
      <Prose
        updated="July 24, 2026"
        intro="By using the Nifty Needle website and placing an order, you agree to the following terms."
        sections={[
          {
            heading: "Orders & pricing",
            body: [
              "All orders are subject to acceptance and availability. Prices are shown in your selected currency and may change without notice, though changes won't affect orders already confirmed.",
            ],
          },
          {
            heading: "Handmade nature",
            body: [
              "Every item is handmade, so slight variations in colour, size, and finish are natural and part of each piece's charm — they are not defects.",
            ],
          },
          {
            heading: "Custom orders",
            body: [
              "Custom orders begin only after a quote is approved. Because they are made to your specification, they are non-refundable except where an item arrives damaged or defective.",
            ],
          },
          {
            heading: "Intellectual property",
            body: [
              "All content on this site — including images, text, and designs — is the property of Nifty Needle and may not be reproduced without permission.",
            ],
          },
          {
            heading: "Limitation of liability",
            body: [
              "To the extent permitted by law, Nifty Needle is not liable for indirect or consequential losses arising from the use of our products or website.",
            ],
          },
        ]}
      />
    </>
  );
}
