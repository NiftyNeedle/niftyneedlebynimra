"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn, type AuthState } from "@/app/auth/actions";
import { GoogleButton, authField } from "./google-button";

export function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/account";
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    {},
  );

  return (
    <div className="space-y-4">
      <GoogleButton />
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="from" value={from} />
        <input type="email" name="email" required placeholder="Email" className={authField} />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className={authField}
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-accent hover:underline">
            Forgot password?
          </Link>
        </div>
        {state.error && <p className="text-sm text-accent">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
