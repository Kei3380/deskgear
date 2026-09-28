import Link from "next/link";
import { X } from "lucide-react";

import type { SortOption } from "@/lib/products";
import { DEFAULT_SORT, SORT_LABELS } from "@/lib/sort-options";

type Filters = { category?: string; categoryLabel?: string; manufacturer?: string; sort: SortOption };

/** 指定のキーを除いた検索URLを組み立てる */
function buildHref(filters: Filters, omit: "category" | "manufacturer" | "sort"): string {
  const params = new URLSearchParams();
  if (filters.category && omit !== "category") params.set("category", filters.category);
  if (filters.manufacturer && omit !== "manufacturer") params.set("manufacturer", filters.manufacturer);
  if (omit !== "sort" && filters.sort !== DEFAULT_SORT) params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

function Chip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-medium text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
      aria-label={`条件「${label}」を解除`}
    >
      {label}
      <X className="size-3" aria-hidden />
    </Link>
  );
}

/** 適用中の絞り込み条件をチップで表示し、個別に解除できるようにする */
export function ActiveFilters(filters: Filters) {
  const chips: { label: string; href: string }[] = [];
  if (filters.category) {
    chips.push({ label: filters.categoryLabel ?? filters.category, href: buildHref(filters, "category") });
  }
  if (filters.manufacturer) {
    chips.push({ label: filters.manufacturer, href: buildHref(filters, "manufacturer") });
  }
  if (filters.sort !== DEFAULT_SORT) {
    chips.push({ label: SORT_LABELS[filters.sort], href: buildHref(filters, "sort") });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground">絞り込み中:</span>
      {chips.map((chip) => (
        <Chip key={chip.label} {...chip} />
      ))}
      <Link href="/search" className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline">
        すべてクリア
      </Link>
    </div>
  );
}
