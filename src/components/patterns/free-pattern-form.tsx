"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Mail, Send } from "lucide-react";
import {
  requestFreePattern,
  type FreePatternState,
} from "@/app/patterns/actions";
import { useToast } from "@/components/ui/toast";

export function FreePatternForm({
  patternId,
  title,
}: {
  patternId: string;
  title: string;
}) {
  const toast = useToast();
  const [state, formAction, pending] = useActionState<FreePatternState, FormData>(
    requestFreePattern,
    {},
  );
  const [sent, setSent] = useState(false);
  const [already, setAlready] = useState(false);

  useEffect(() => {
    if (state.ok) {
      setSent(true);
      setAlready(Boolean(state.already));
    } else if (state.error) toast(state.error, "info");
  }, [state, toast]);

  if (sent) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-sage-deep px-5 py-4 text-warm-white">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/20">
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm">
          {already ? (
            <>
              <strong>{title}</strong> is already in your inbox — we sent it to
              this email before. Check your mail (and the spam folder just in
              case).
            </>
          ) : (
            <>
              Sent! Check your inbox — <strong>{title}</strong> is on its way
              (do peek in spam just in case).
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="pattern_id" value={patternId} />
      <label className="block text-sm font-medium text-foreground">
        Get this free pattern by email
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            aria-label="Email address"
            className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send it to me"}
          {!pending && <Send className="h-4 w-4" />}
        </button>
      </div>
      <p className="text-xs text-muted">
        We&apos;ll email you the PDF. No spam, unsubscribe anytime.
      </p>
    </form>
  );
}
