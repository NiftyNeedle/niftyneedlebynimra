import Link from "next/link";
import type { Metadata } from "next";
import {
  AuthShell,
  GoogleButton,
  authField,
} from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Nifty Needle account.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the Nifty Needle circle for faster checkout and order tracking."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Sign in
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
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="First name" className={authField} />
            <input placeholder="Last name" className={authField} />
          </div>
          <input type="email" placeholder="Email" className={authField} />
          <input type="password" placeholder="Password" className={authField} />
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
          <button className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
            Create account
          </button>
        </form>
      </div>
    </AuthShell>
  );
}
