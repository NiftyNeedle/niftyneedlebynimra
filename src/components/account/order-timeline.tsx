import { Check } from "lucide-react";
import { orderStages, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const currentIndex = orderStages.indexOf(status);
  return (
    <ol className="grid grid-cols-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
      {orderStages.map((stage, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <li key={stage} className="flex items-start gap-2">
            <span
              className={cn(
                "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold",
                done && "bg-sage-deep text-white",
                current && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                !done && !current && "bg-surface-muted text-muted",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-xs leading-tight",
                current ? "font-semibold text-foreground" : "text-muted",
              )}
            >
              {stage}
            </span>
          </li>
        );
      })}
    </ol>
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
