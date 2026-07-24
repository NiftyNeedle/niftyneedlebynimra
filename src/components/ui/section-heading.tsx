import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full bg-surface-muted px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal index={1}>
        <h2 className="max-w-2xl text-balance font-serif text-4xl font-semibold leading-tight text-foreground md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal index={2}>
          <p className="max-w-2xl text-balance text-base leading-relaxed text-muted md:text-lg">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
