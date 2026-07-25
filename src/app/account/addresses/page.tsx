import { createClient } from "@/lib/supabase/server";
import { AddressesManager, type Address } from "@/components/account/addresses-manager";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  return <AddressesManager addresses={(data as Address[]) ?? []} />;
}
