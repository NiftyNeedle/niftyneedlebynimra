import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";

const addresses = [
  {
    id: "a1",
    label: "Home",
    name: "Arham Ashraf",
    line: "12 Willow Lane, Apt 4",
    city: "Manchester, M1 2AB",
    country: "United Kingdom",
    default: true,
  },
  {
    id: "a2",
    label: "Work",
    name: "Arham Ashraf",
    line: "Hull Technologies, 40 Market St",
    city: "Hull, HU1 1RS",
    country: "United Kingdom",
    default: false,
  },
];

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl text-foreground">Saved addresses</h2>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">
          <Plus className="h-4 w-4" />
          Add address
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div
            key={a.id}
            className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {a.label}
                {a.default && (
                  <span className="rounded-full bg-sage/20 px-2 py-0.5 text-xs text-sage-deep">
                    Default
                  </span>
                )}
              </span>
              <div className="flex gap-1">
                <button aria-label="Edit" className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface-muted">
                  <Pencil className="h-4 w-4" />
                </button>
                <button aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface-muted hover:text-accent">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-0.5 text-sm text-muted">
              <p className="font-medium text-foreground">{a.name}</p>
              <p>{a.line}</p>
              <p>{a.city}</p>
              <p>{a.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
