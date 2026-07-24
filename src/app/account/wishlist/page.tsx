import { WishlistGrid } from "@/components/account/wishlist-grid";
import { getProducts } from "@/lib/catalog";

export const revalidate = 60;

export default async function AccountWishlistPage() {
  const products = await getProducts();
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-foreground">Your wishlist</h2>
      <WishlistGrid products={products} />
    </div>
  );
}
