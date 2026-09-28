import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

/** 評価スコア表示。★の色はサイト全体で `--rating` に統一する */
export function Rating({
  rating,
  showMax = false,
  className,
}: {
  rating: number | null;
  /** true のとき「/ 5.0」を併記する（詳細ページ用） */
  showMax?: boolean;
  className?: string;
}) {
  if (rating === null) {
    return <span className={cn("text-sm text-muted-foreground", className)}>評価未定</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-1 text-sm tabular-nums", className)}>
      <Star className="size-4 fill-rating text-rating" aria-hidden />
      <span className="font-medium">{rating.toFixed(1)}</span>
      {showMax && <span className="text-muted-foreground">/ 5.0</span>}
    </span>
  );
}
