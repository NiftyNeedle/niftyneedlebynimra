const data = [
  { month: "Jan", value: 320 },
  { month: "Feb", value: 410 },
  { month: "Mar", value: 380 },
  { month: "Apr", value: 520 },
  { month: "May", value: 610 },
  { month: "Jun", value: 700 },
  { month: "Jul", value: 840 },
];

export function RevenueChart() {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <figure>
      <figcaption className="sr-only">Monthly revenue for 2026</figcaption>
      <div className="flex h-56 items-end gap-3">
        {data.map((d) => (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-brown-deep to-brown transition-all"
                style={{ height: `${(d.value / max) * 100}%` }}
                title={`$${d.value.toLocaleString()}`}
              />
            </div>
            <span className="text-xs text-muted">{d.month}</span>
          </div>
        ))}
      </div>
    </figure>
  );
}
