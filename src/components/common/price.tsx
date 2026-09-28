import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

export function Price({ price, className }: { price: number; className?: string }) {
  return <span className={cn("font-bold tabular-nums", className)}>{formatPrice(price)}</span>;
}
