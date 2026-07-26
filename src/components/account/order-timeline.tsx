import {
  BadgeCheck,
  Check,
  ClipboardList,
  PackageCheck,
  Scissors,
  Sparkles,
  Truck,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { orderStages, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

const STAGE_ICON: Record<OrderStatus, ComponentType<SVGProps<SVGSVGElement>>> = {
  "Order Received": ClipboardList,
  "In Production": Scissors,
  "Quality Check": BadgeCheck,
  Packed: PackageCheck,
  Shipped: Truck,
  Delivered: Sparkles,
};

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = orderStages.indexOf(status);
  const lastIndex = orderStages.length - 1;
  const progress =
    currentIndex <= 0 ? 0 : (currentIndex / lastIndex) * 100;

  return (
    <>
      {/* Horizontal stepper (sm and up) */}
      <div className="relative hidden px-3 sm:block">
        {/* track + progress line (behind the circles, aligned to their centres) */}
        <div className="absolute left-[9%] right-[9%] top-5 h-1 rounded-full bg-border" />
        <div
          className="absolute left-[9%] top-5 h-1 rounded-full bg-sage-deep transition-all duration-500"
          style={{ width: `calc((100% - 18%) * ${progress / 100})` }}
        />
        <ol className="relative grid grid-cols-6 gap-2">
          {orderStages.map((stage, i) => {
            const done = i < currentIndex;
            const current = i === currentIndex;
            const Icon = STAGE_ICON[stage];
            return (
              <li key={stage} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-full border-2 bg-surface transition-colors",
                    done && "border-sage-deep bg-sage-deep text-white",
                    current &&
                      "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                    !done && !current && "border-border text-muted",
                  )}
                >
                  {done ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </span>
                <span
                  className={cn(
                    "mt-2 text-xs leading-tight",
                    current
                      ? "font-semibold text-foreground"
                      : done
                        ? "text-foreground/80"
                        : "text-muted",
                  )}
                >
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Vertical stepper (mobile) */}
      <ol className="sm:hidden">
        {orderStages.map((stage, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          const Icon = STAGE_ICON[stage];
          const isLast = i === lastIndex;
          return (
            <li key={stage} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 bg-surface",
                    done && "border-sage-deep bg-sage-deep text-white",
                    current &&
                      "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                    !done && !current && "border-border text-muted",
                  )}
                >
                  {done ? (
                    <Check className="h-4.5 w-4.5" />
                  ) : (
                    <Icon className="h-4.5 w-4.5" />
                  )}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "my-1 w-0.5 flex-1",
                      i < currentIndex ? "bg-sage-deep" : "bg-border",
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "pb-6 pt-1.5 text-sm",
                  current
                    ? "font-semibold text-foreground"
                    : done
                      ? "text-foreground/80"
                      : "text-muted",
                )}
              >
                {stage}
              </span>
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const tone =
    status === "Delivered"
      ? "bg-sage/20 text-sage-deep"
      : status === "Shipped"
        ? "bg-pink/20 text-pink-deep"
        : "bg-surface-muted text-primary";
  return (
    <span className={cn("rounded-full px-3 py-1 text-xs font-medium", tone)}>
      {status}
    </span>
  );
}
