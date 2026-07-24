import { getProducts } from "@/lib/catalog";
import { ProductsManager } from "@/components/admin/products-manager";

// Always show the freshest product list in the admin.
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <ProductsManager products={products} />;
}
