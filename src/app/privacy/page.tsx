import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { Prose } from "@/components/ui/prose";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Nifty Needle collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" crumbs={[{ label: "Privacy Policy" }]} />
      <Prose
        updated="July 24, 2026"
        intro="Your privacy matters to us. This policy explains what data we collect, why, and how we keep it safe."
        sections={[
          {
            heading: "Information we collect",
            body: [
              "We collect information you provide directly — such as your name, email, shipping address, and order details — as well as limited technical data (like your browser type and pages visited) to improve our service.",
            ],
          },
          {
            heading: "How we use your information",
            body: [
              "We use your data to process orders, communicate with you, provide support, and — only with your consent — send occasional marketing emails. We never sell your personal information.",
            ],
          },
          {
            heading: "Payments",
            body: [
              "Payments are processed securely by Stripe. We do not store your full card details on our servers.",
            ],
          },
          {
            heading: "Cookies",
            body: [
              "We use essential cookies to run the site and, with your consent, analytics cookies to understand how it's used. You can manage your preferences at any time.",
            ],
          },
          {
            heading: "Your rights",
            body: [
              "You may request access to, correction of, or deletion of your personal data at any time by contacting niftyneedlebynimra@gmail.com. We comply with GDPR and applicable data-protection laws.",
            ],
          },
        ]}
      />
    </>
  );
}
