import { Bell, Package, Tag, Sparkles } from "lucide-react";

const notifications = [
  {
    id: "n1",
    Icon: Package,
    title: "Your order NN-1042 has shipped",
    time: "2 days ago",
    unread: true,
  },
  {
    id: "n2",
    Icon: Tag,
    title: "A wishlist item is now on sale",
    time: "5 days ago",
    unread: true,
  },
  {
    id: "n3",
    Icon: Sparkles,
    title: "Your custom quote is ready to review",
    time: "1 week ago",
    unread: false,
  },
];

const prefs = [
  "Order confirmations",
  "Shipping updates",
  "Custom order replies",
  "Newsletter & offers",
  "Browser push notifications",
];

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 font-serif text-2xl text-foreground">
          Notifications
        </h2>
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-center gap-4 rounded-2xl border p-4 ${
                n.unread ? "border-primary/30 bg-surface-muted/40" : "border-border bg-surface"
              }`}
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-surface-muted text-primary">
                <n.Icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="text-xs text-muted">{n.time}</p>
              </div>
              {n.unread && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
        <h3 className="mb-4 flex items-center gap-2 font-serif text-xl text-foreground">
          <Bell className="h-5 w-5" />
          Preferences
        </h3>
        <div className="space-y-3">
          {prefs.map((p, i) => (
            <label
              key={p}
              className="flex items-center justify-between text-sm text-foreground"
            >
              {p}
              <input
                type="checkbox"
                defaultChecked={i < 4}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
