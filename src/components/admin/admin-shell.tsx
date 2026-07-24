"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AdminNav } from "./admin-nav";
import { Logo } from "@/components/layout/logo";

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Login page: no sidebar chrome.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen bg-espresso lg:block">
        <AdminNav />
      </aside>

      <div className="min-h-screen bg-surface-muted/40">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-espresso px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2.5">
            <Logo showText={false} size={34} />
            <span className="font-serif text-lg text-warm-white">
              Admin Studio
            </span>
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open admin menu"
            className="grid h-10 w-10 place-items-center rounded-full text-warm-white transition-colors hover:bg-warm-white/10"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 md:p-10">{children}</div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-espresso/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed left-0 top-0 z-50 h-full w-[80%] max-w-xs bg-espresso lg:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Close admin menu"
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full text-warm-white transition-colors hover:bg-warm-white/10"
              >
                <X className="h-6 w-6" />
              </button>
              <AdminNav />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
