"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ruler } from "lucide-react";
import type { Pattern } from "@/lib/patterns";
import { patternSwatch } from "@/lib/patterns";
import { useCurrency } from "@/components/currency/currency-provider";

export function PatternCard({
  pattern,
  index,
}: {
  pattern: Pattern;
  index: number;
}) {
  const { format } = useCurrency();
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]"
    >
      <Link
        href={`/patterns/${pattern.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        {pattern.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pattern.imageUrl}
            alt={pattern.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
            style={{ background: patternSwatch(index) }}
          />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ${
            pattern.isFree
              ? "bg-sage-deep text-white"
              : "glass text-foreground"
          }`}
        >
          {pattern.isFree ? "Free" : "PDF Pattern"}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg leading-snug text-foreground">
          <Link href={`/patterns/${pattern.slug}`} className="hover:underline">
            {pattern.title}
          </Link>
        </h3>
        {pattern.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {pattern.description}
          </p>
        )}
        {pattern.finishedSize && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
            <Ruler className="h-3.5 w-3.5" />
            {pattern.finishedSize}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">
            {pattern.isFree ? "Free" : format(pattern.price, "EUR")}
          </span>
          <Link
            href={`/patterns/${pattern.slug}`}
            className="rounded-full bg-surface-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {pattern.isFree ? "Get it" : "View"}
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
