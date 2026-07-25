"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp, type AuthState } from "@/app/auth/actions";
import { GoogleButton, authField } from "./google-button";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signUp,
    {},
  );

  if (state.message) {
    return (
      <div className="rounded-2xl border border-sage-deep/30 bg-sage/10 p-6 text-center">
        <p className="font-serif text-xl text-foreground">Check your inbox ✉️</p>
        <p className="mt-2 text-sm text-muted">{state.message}</p>
        <Link
          href="/login"
          className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <GoogleButton />
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <form action={formAction} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="firstName" placeholder="First name" className={authField} />
          <input name="lastName" placeholder="Last name" className={authField} />
        </div>
        <input type="email" name="email" required placeholder="Email" className={authField} />
        <input
          type="password"
          name="password"
          required
          placeholder="Password (min 6 characters)"
          className={authField}
        />
        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 accent-[var(--color-primary)]"
          />
          I agree to the{" "}
          <Link href="/terms" className="text-accent hover:underline">
            Terms
          </Link>{" "}
          &amp;{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </label>
        {state.error && <p className="text-sm text-accent">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
