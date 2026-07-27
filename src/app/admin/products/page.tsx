import { getAdminProducts } from "@/lib/catalog";
import { ProductsManager } from "@/components/admin/products-manager";

// Always show the freshest product list in the admin.
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  // Runtime diagnostic: confirms whether this deployment can write to the DB.
  const envStatus = {
    url: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    serviceKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
  };
  const writable = envStatus.url && envStatus.serviceKey;

  return (
    <>
      {!writable && (
        <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-sm">
          <p className="font-medium text-foreground">
            ⚠️ This deployment can’t save products yet.
          </p>
          <p className="mt-1 text-muted">
            Environment seen by the server right now — Supabase URL:{" "}
            <b>{String(envStatus.url)}</b>, SERVICE key:{" "}
            <b>{String(envStatus.serviceKey)}</b>, Admin password:{" "}
            <b>{String(envStatus.adminPassword)}</b>. Add any that show{" "}
            <b>false</b> in Vercel → Settings → Environment Variables, then{" "}
            <b>redeploy</b>.
          </p>
        </div>
      )}
      <ProductsManager products={products} />
    </>
  );
}
