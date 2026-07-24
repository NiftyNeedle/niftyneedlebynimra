"use client";

import { Check, MessageSquare, X, FileText } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const requests = [
  {
    id: "CR-208",
    name: "Elena V.",
    type: "Plushie / Amigurumi",
    occasion: "New baby",
    budget: "$50 – $100",
    deadline: "2026-08-15",
    note: "A pastel elephant plushie with the baby's name 'Leo' embroidered.",
    status: "New",
  },
  {
    id: "CR-207",
    name: "Marcus T.",
    type: "Bouquet / Flowers",
    occasion: "Wedding",
    budget: "$100 – $200",
    deadline: "2026-09-01",
    note: "18-stem bouquet in sage & ivory to match bridesmaid dresses.",
    status: "Quoted",
  },
  {
    id: "CR-206",
    name: "Aisha K.",
    type: "Home décor",
    occasion: "Just because",
    budget: "Under $50",
    deadline: "Flexible",
    note: "Set of 3 hanging plant cozies in earthy tones.",
    status: "New",
  },
];

export function CustomRequests() {
  const toast = useToast();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Custom order requests
        </h1>
        <p className="text-sm text-muted">
          Review, quote, and convert bespoke requests into orders.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {requests.map((r) => (
          <div
            key={r.id}
            className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-serif text-xl text-foreground">{r.name}</p>
                <p className="text-sm text-muted">
                  {r.id} · {r.type}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  r.status === "New"
                    ? "bg-pink/20 text-pink-deep"
                    : "bg-sage/20 text-sage-deep"
                }`}
              >
                {r.status}
              </span>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div>
                <dt className="text-muted">Occasion</dt>
                <dd className="font-medium text-foreground">{r.occasion}</dd>
              </div>
              <div>
                <dt className="text-muted">Budget</dt>
                <dd className="font-medium text-foreground">{r.budget}</dd>
              </div>
              <div>
                <dt className="text-muted">Deadline</dt>
                <dd className="font-medium text-foreground">{r.deadline}</dd>
              </div>
            </dl>

            <p className="mt-4 rounded-2xl bg-surface-muted/50 p-4 text-sm text-muted">
              {r.note}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => toast(`Quote sent to ${r.name}`)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <FileText className="h-4 w-4" />
                Send quote
              </button>
              <button
                onClick={() => toast(`${r.id} approved & converted to order`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-muted"
              >
                <Check className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={() => toast(`Message thread opened with ${r.name}`, "info")}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-surface-muted"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </button>
              <button
                onClick={() => toast(`${r.id} rejected`, "info")}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-accent"
              >
                <X className="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
