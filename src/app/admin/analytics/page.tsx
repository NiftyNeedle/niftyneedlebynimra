import { RevenueChart } from "@/components/admin/revenue-chart";

const sources = [
  { label: "Instagram", value: 42 },
  { label: "Direct", value: 24 },
  { label: "Google", value: 18 },
  { label: "Pinterest", value: 11 },
  { label: "Other", value: 5 },
];

const kpis = [
  { label: "Conversion rate", value: "3.8%" },
  { label: "Avg. order value", value: "$66" },
  { label: "Repeat customers", value: "41%" },
  { label: "Cart abandonment", value: "62%" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl font-semibold text-foreground">
        Analytics
      </h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-3xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]"
          >
            <p className="font-serif text-3xl font-semibold text-foreground">
              {k.value}
            </p>
            <p className="text-sm text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-6 font-serif text-xl text-foreground">
            Revenue trend
          </h2>
          <RevenueChart />
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-6 font-serif text-xl text-foreground">
            Traffic sources
          </h2>
          <div className="space-y-4">
            {sources.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-foreground">{s.label}</span>
                  <span className="text-muted">{s.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brown-deep to-accent"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
