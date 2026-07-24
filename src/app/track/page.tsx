import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { TrackOrder } from "@/components/track/track-order";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the status of your handmade crochet order.",
};

export default function TrackPage() {
  return (
    <>
      <PageHeader
        eyebrow="Order Status"
        title="Track your order"
        description="Enter your order number to see exactly where your handmade piece is on its journey."
        crumbs={[{ label: "Order Tracking" }]}
      />
      <TrackOrder />
    </>
  );
}
