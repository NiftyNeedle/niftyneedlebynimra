import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/layout/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-brown-deep lg:block">
        <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-pink/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sage/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-warm-white">
          <Logo light />
          <div>
            <p className="max-w-md font-serif text-4xl leading-tight">
              &ldquo;Every stitch tells a story — and yours is just beginning.&rdquo;
            </p>
            <p className="mt-4 text-warm-white/70">
              Handmade crochet, made with love and made just for you.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-warm-white/70">
            <span>Handmade to order</span>
            <span>·</span>
            <span>One stitch at a time</span>
            <span>·</span>
            <span>100% handmade</span>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-serif text-4xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-center text-sm text-muted">{footer}</div>
          <p className="mt-8 text-center text-xs text-muted">
            <Link href="/" className="hover:text-foreground">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function GoogleButton() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        />
      </svg>
      Continue with Google
    </button>
  );
}

export const authField =
  "w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";
