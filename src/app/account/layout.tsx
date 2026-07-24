import type { ReactNode } from "react";
import { AccountNav } from "@/components/account/account-nav";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="section-px mx-auto max-w-[90rem] py-12">
      <div className="mb-8 flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brown to-brown-deep font-serif text-xl font-semibold text-warm-white">
          AA
        </span>
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Hi, Arham
          </h1>
          <p className="text-sm text-muted">Welcome to your account</p>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
