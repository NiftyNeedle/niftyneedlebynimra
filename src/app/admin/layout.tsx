import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata = {
  title: "Admin Studio",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
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
