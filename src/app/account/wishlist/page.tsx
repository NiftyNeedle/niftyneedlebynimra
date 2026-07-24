import { WishlistGrid } from "@/components/account/wishlist-grid";

export default function AccountWishlistPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-foreground">Your wishlist</h2>
      <WishlistGrid />
    </div>
  );
}
