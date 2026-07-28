"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  FileText,
  FolderTree,
  LayoutDashboard,
  Mail,
  Newspaper,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { logout } from "@/app/admin/login/actions";

const links = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Box },
  { href: "/admin/categories", label: "Categories", Icon: FolderTree },
  { href: "/admin/patterns", label: "Patterns", Icon: FileText },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/custom-orders", label: "Custom Orders", Icon: Sparkles },
  { href: "/admin/reviews", label: "Reviews", Icon: Star },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/coupons", label: "Coupons", Icon: Tag },
  { href: "/admin/blog", label: "Blog", Icon: Newspaper },
  { href: "/admin/newsletter", label: "Newsletter", Icon: Mail },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <Logo showText={false} size={40} />
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-warm-white/50">
          Admin Studio
        </p>
      </div>
      <nav className="admin-scroll min-h-0 flex-1 space-y-1 overflow-y-auto px-4">
        {links.map(({ href, label, Icon }) => {
          const active =
            href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-warm-white/15 text-warm-white"
                  : "text-warm-white/70 hover:bg-warm-white/10 hover:text-warm-white",
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-warm-white/70 transition-colors hover:bg-warm-white/10 hover:text-warm-white"
        >
          ← Back to store
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-warm-white/70 transition-colors hover:bg-warm-white/10 hover:text-warm-white"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
