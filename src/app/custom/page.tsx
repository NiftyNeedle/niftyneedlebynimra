import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CustomOrderForm } from "@/components/custom/custom-order-form";

export const metadata: Metadata = {
  title: "Create Your Own Crochet",
  description:
    "Commission a fully custom handmade crochet piece. Share your idea, colours, budget, and references — we'll bring it to life.",
};

export default function CustomPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fully Custom Orders"
        title="Create your own crochet"
        description="Dreamed up something we don't make yet? Tell us about it and we'll craft it just for you, stitch by stitch."
        crumbs={[{ label: "Custom Orders" }]}
      />
      <CustomOrderForm />
    </>
  );
}
