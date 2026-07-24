"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-surface-muted",
        className,
      )}
    >
      {mounted ? (
        <span className="relative block h-5 w-5">
          <Sun
            className={cn(
              "absolute inset-0 h-5 w-5 transition-all duration-500",
              isDark ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
            )}
          />
          <Moon
            className={cn(
              "absolute inset-0 h-5 w-5 transition-all duration-500",
              isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0",
            )}
          />
        </span>
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
