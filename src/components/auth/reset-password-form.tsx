"use client";

import { useActionState } from "react";
import Link from "next/link";
import { updatePassword, type AuthState } from "@/app/auth/actions";
import { authField } from "./google-button";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    {},
  );

  if (state.message) {
    return (
      <div className="rounded-2xl border border-sage-deep/30 bg-sage/10 p-6 text-center">
        <p className="text-sm text-muted">{state.message}</p>
        <Link
          href="/account"
          className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
        >
          Go to my account
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="password"
        name="password"
        required
        placeholder="New password (min 6 characters)"
        className={authField}
      />
      {state.error && <p className="text-sm text-accent">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
      >
        {pending ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
