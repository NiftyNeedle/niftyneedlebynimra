import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell, authField } from "@/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your Nifty Needle account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a secure reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form className="space-y-4">
        <input type="email" placeholder="Email" className={authField} />
        <button className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
          Send reset link
        </button>
      </form>
    </AuthShell>
  );
}
