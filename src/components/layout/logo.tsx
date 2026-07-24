import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = 44,
  showText = true,
  light = false,
}: {
  className?: string;
  /** Badge diameter in px. */
  size?: number;
  /** Show the "Nifty Needle" wordmark beside the badge. */
  showText?: boolean;
  /** Use light text — for placing the logo on dark backgrounds. */
  light?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Nifty Needle home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span
        className="relative block shrink-0 overflow-hidden rounded-full ring-1 ring-black/5 transition-transform duration-500 group-hover:scale-105"
        style={{ height: size, width: size }}
      >
        <Image
          src="/logo.jpeg"
          alt="Nifty Needle — handcrafted crochet"
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-serif text-xl font-semibold tracking-tight",
              light ? "text-warm-white" : "text-foreground",
            )}
          >
            Nifty Needle
          </span>
          <span
            className={cn(
              "text-[0.6rem] uppercase tracking-[0.28em]",
              light ? "text-warm-white/60" : "text-muted",
            )}
          >
            Handcrafted Crochet
          </span>
        </span>
      )}
    </Link>
  );
}
