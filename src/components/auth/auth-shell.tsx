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

