"use client";

import { useActionState, useEffect } from "react";
import { Bell } from "lucide-react";
import { updateNotificationPrefs, type AuthState } from "@/app/auth/actions";
import { useToast } from "@/components/ui/toast";

interface Prefs {
  orders?: boolean;
  shipping?: boolean;
  custom?: boolean;
  marketing?: boolean;
}

const options = [
  { name: "orders", label: "Order confirmations" },
  { name: "shipping", label: "Shipping updates" },
  { name: "custom", label: "Custom order replies" },
  { name: "marketing", label: "Newsletter & offers" },
] as const;

export function NotificationPrefs({ prefs }: { prefs: Prefs }) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updateNotificationPrefs,
    {},
  );

  useEffect(() => {
    if (state.message) toast(state.message);
    else if (state.error) toast(state.error, "info");
  }, [state, toast]);

  return (
    <form
      action={formAction}
      className="rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
    >
      <h3 className="mb-4 flex items-center gap-2 font-serif text-xl text-foreground">
        <Bell className="h-5 w-5" />
        Preferences
      </h3>
      <div className="space-y-3">
        {options.map((o) => (
          <label
            key={o.name}
            className="flex items-center justify-between text-sm text-foreground"
          >
            {o.label}
            <input
              type="checkbox"
              name={o.name}
              defaultChecked={prefs[o.name] ?? true}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
          </label>
        ))}
      </div>
      <button
        disabled={pending}
        className="mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save preferences"}
      </button>
    </form>
  );
}
