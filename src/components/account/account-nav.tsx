"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/account", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", Icon: Package },
  { href: "/account/wishlist", label: "Wishlist", Icon: Heart },
  { href: "/account/addresses", label: "Addresses", Icon: MapPin },
  { href: "/account/designs", label: "Saved Designs", Icon: Sparkles },
  { href: "/account/notifications", label: "Notifications", Icon: Bell },
  { href: "/account/profile", label: "Profile", Icon: User },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
      {links.map(({ href, label, Icon }) => {
        const active =
          href === "/account" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-surface-muted",
            )}
          >
            <Icon className="h-4.5 w-4.5" />
            {label}
          </Link>
        );
      })}
      <Link
        href="/login"
        className="flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-accent transition-colors hover:bg-surface-muted"
      >
        <LogOut className="h-4.5 w-4.5" />
        Sign out
      </Link>
    </nav>
  );
}
