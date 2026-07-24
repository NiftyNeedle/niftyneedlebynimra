import type { Metadata } from "next";
import { Share2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { WishlistGrid } from "@/components/account/wishlist-grid";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Your saved handmade crochet treasures.",
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saved For Later"
        title="Your wishlist"
        description="Everything you've fallen for, kept in one place. Share it or move items to your cart."
        crumbs={[{ label: "Wishlist" }]}
      />
      <div className="section-px mx-auto max-w-[90rem] py-12">
        <div className="mb-6 flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-surface-muted">
            <Share2 className="h-4 w-4" />
            Share wishlist
          </button>
        </div>
        <WishlistGrid />
      </div>
    </>
  );
}
