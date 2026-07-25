import { Package, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getMyOrders, getMyCustomOrders } from "@/lib/account";
import { NotificationPrefs } from "@/components/account/notification-prefs";

export const dynamic = "force-dynamic";

interface FeedItem {
  icon: "order" | "custom";
  title: string;
  time: string;
  date: number;
}

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const prefs =
    (auth.user?.user_metadata?.notif_prefs as Record<string, boolean>) ?? {};

  const [orders, customs] = await Promise.all([
    getMyOrders(),
    getMyCustomOrders(),
  ]);

  const feed: FeedItem[] = [
    ...orders.map((o) => ({
      icon: "order" as const,
      title: `Order ${o.order_number} is now “${o.status}”`,
      time: new Date(o.created_at).toLocaleDateString(),
      date: new Date(o.created_at).getTime(),
    })),
    ...customs.map((c) => ({
      icon: "custom" as const,
      title: `Custom request “${c.title || c.product_type || "your idea"}” is “${c.status}”`,
      time: new Date(c.created_at).toLocaleDateString(),
      date: new Date(c.created_at).getTime(),
    })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 12);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 font-serif text-2xl text-foreground">Notifications</h2>
        {feed.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-16 text-center">
            <p className="text-muted">No activity yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feed.map((n, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-muted text-primary">
                  {n.icon === "order" ? (
                    <Package className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NotificationPrefs prefs={prefs} />
    </div>
  );
}
