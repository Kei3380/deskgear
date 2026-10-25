import { PackageOpen } from "lucide-react";

import { CATEGORY_ICONS } from "@/lib/category-icons";
import type { CategoryGuide } from "@/lib/category-guides";

export function CategoryHero({
  guide,
  productCount,
}: {
  guide: CategoryGuide;
  productCount: number;
}) {
  const Icon = CATEGORY_ICONS[guide.slug] ?? PackageOpen;

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-linear-to-b from-primary/10 via-primary/5 to-transparent p-6 sm:p-10 ring-1 ring-border">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Icon className="size-3.5" aria-hidden />
          {guide.categoryLabel} 特集・完全ガイド
        </span>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
          レビュー掲載 {productCount}件
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {guide.headline}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {guide.intro}
        </p>
      </div>
    </div>
  );
}
