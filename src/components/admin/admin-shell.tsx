"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AdminNav } from "./admin-nav";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Login page: no sidebar chrome.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen bg-espresso lg:block">
        <AdminNav />
      </aside>
      <div className="min-h-screen bg-surface-muted/40">
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
