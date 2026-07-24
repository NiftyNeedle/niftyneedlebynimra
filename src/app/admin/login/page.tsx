"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { login, type LoginState } from "./actions";
import { Logo } from "@/components/layout/logo";

function LoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted/40 p-6">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-[var(--shadow-lift)]">
        <Logo />
        <h1 className="mt-6 font-serif text-3xl font-semibold text-foreground">
          Admin Studio
        </h1>
        <p className="mt-1 text-sm text-muted">
          Enter your password to manage the shop.
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="from" value={from} />
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="password"
              name="password"
              required
              autoFocus
              placeholder="Password"
              className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {state.error && (
            <p className="text-sm text-accent">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
