import Link from "next/link";
import type { Metadata } from "next";
import {
  AuthShell,
  GoogleButton,
  authField,
} from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Nifty Needle account.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to track orders, save designs, and more."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <GoogleButton />
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className={authField} />
          <input type="password" placeholder="Password" className={authField} />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" className="h-4 w-4 accent-[var(--color-primary)]" />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <button className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
            Sign in
          </button>
        </form>
        <button className="w-full rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-muted">
          Email me a one-time code instead
        </button>
      </div>
    </AuthShell>
  );
}
