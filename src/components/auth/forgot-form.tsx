"use client";

import { useActionState } from "react";
import { sendReset, type AuthState } from "@/app/auth/actions";
import { authField } from "./google-button";

export function ForgotForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    sendReset,
    {},
  );

  if (state.message) {
    return (
      <div className="rounded-2xl border border-sage-deep/30 bg-sage/10 p-6 text-center text-sm text-muted">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="email" name="email" required placeholder="Email" className={authField} />
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
