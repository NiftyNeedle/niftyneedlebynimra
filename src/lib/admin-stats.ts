import { createAdminClient } from "@/lib/supabase/admin";

export interface DashRecentOrder {
  order_number: string;
  name: string | null;
  total: number;
  status: string;
  created_at: string;
}
export interface DashLowStock {
  id: string;
  name: string;
  swatch: string;
  image_url: string | null;
}
export interface DashPopular {
  name: string;
  units: number;
}

export interface DashboardData {
  revenue: number;
  orderCount: number;
  pendingPayment: number;
  productCount: number;
  customNew: number;
  pendingReviews: number;
  recentOrders: DashRecentOrder[];
  lowStock: DashLowStock[];
  popular: DashPopular[];
}

const EMPTY: DashboardData = {
  revenue: 0,
  orderCount: 0,
  pendingPayment: 0,
  productCount: 0,
  customNew: 0,
  pendingReviews: 0,
  recentOrders: [],
  lowStock: [],
  popular: [],
};

interface OrderRow {
  order_number: string;
  name: string | null;
  total: number;
  status: string;
  created_at: string;
  items: { name: string; quantity: number }[] | null;
}

export interface CustomerRow {
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrder: string;
}

export async function getCustomers(): Promise<CustomerRow[]> {
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("orders")
      .select("name,email,total,status,created_at")
      .neq("status", "Pending payment")
      .order("created_at", { ascending: false });
    const rows = (data as
      | { name: string | null; email: string | null; total: number; created_at: string }[]
      | null) ?? [];

    const map = new Map<string, CustomerRow>();
    for (const r of rows) {
      const email = (r.email ?? "").toLowerCase();
      if (!email) continue;
      const existing = map.get(email);
      if (existing) {
        existing.orders += 1;
        existing.spent += Number(r.total);
      } else {
        map.set(email, {
          name: r.name ?? "—",
          email,
          orders: 1,
          spent: Number(r.total),
          lastOrder: r.created_at,
        });
      }
    }
    return [...map.values()].sort((a, b) => b.spent - a.spent);
  } catch {
    return [];
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const admin = createAdminClient();
    const [ordersRes, productsRes, customRes, reviewsRes] = await Promise.all([
      admin
        .from("orders")
        .select("order_number,name,total,status,created_at,items")
        .order("created_at", { ascending: false }),
      admin.from("products").select("id,name,swatch,image_url,in_stock"),
      admin.from("custom_orders").select("status"),
      admin.from("reviews").select("approved"),
    ]);

    const orders = (ordersRes.data as OrderRow[] | null) ?? [];
    const paid = orders.filter((o) => o.status !== "Pending payment");

    // Units sold per product name (from paid orders' line items).
    const tally = new Map<string, number>();
    for (const o of paid) {
      for (const it of o.items ?? []) {
        tally.set(it.name, (tally.get(it.name) ?? 0) + (Number(it.quantity) || 0));
      }
    }
    const popular = [...tally.entries()]
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    const products = productsRes.data ?? [];
    const customs = (customRes.data as { status: string }[] | null) ?? [];
    const reviews = (reviewsRes.data as { approved: boolean }[] | null) ?? [];

    return {
      revenue: paid.reduce((n, o) => n + Number(o.total), 0),
      orderCount: paid.length,
      pendingPayment: orders.length - paid.length,
      productCount: products.length,
      customNew: customs.filter((c) => c.status === "New").length,
      pendingReviews: reviews.filter((r) => !r.approved).length,
      recentOrders: paid.slice(0, 5).map((o) => ({
        order_number: o.order_number,
        name: o.name,
        total: Number(o.total),
        status: o.status,
        created_at: o.created_at,
      })),
      lowStock: products
        .filter((p) => !p.in_stock)
        .map((p) => ({
          id: p.id as string,
          name: p.name as string,
          swatch: p.swatch as string,
          image_url: (p.image_url as string | null) ?? null,
        })),
      popular,
    };
  } catch {
    return EMPTY;
  }
}
