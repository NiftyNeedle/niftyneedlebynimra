"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { BackToTop } from "@/components/ui/back-to-top";
import type { Category } from "@/lib/types";

const bareRoutes = ["/admin"];

export function SiteChrome({
  children,
  categories,
}: {
  children: ReactNode;
  categories: Category[];
}) {
  const pathname = usePathname();
  const bare = bareRoutes.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );

  if (bare) {
    return (
      <>
        <main className="flex-1">{children}</main>
        <CartDrawer />
      </>
    );
  }

  return (
    <>
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <BackToTop />
    </>
  );
}
