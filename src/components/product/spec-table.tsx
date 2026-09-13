import type { ReactNode } from "react";

import { CATEGORIES } from "@/lib/categories";
import type { Product } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

// release_date が "YYYY-MM"（日を指定しない）形式の場合、年月のみで表示する
const yearMonthFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  timeZone: "UTC",
});
const YEAR_MONTH_ONLY = /^\d{4}-\d{2}$/;

const SPEC_ROWS: { label: string; render: (product: Product) => ReactNode }[] = [
  { label: "商品名", render: (p) => p.title },
  { label: "メーカー", render: (p) => p.manufacturer },
  {
    label: "カテゴリ",
    render: (p) => CATEGORIES.find((c) => c.slug === p.category)?.label ?? p.category,
  },
  {
    label: "発売日",
    render: (p) => {
      if (!p.releaseDate) return "発売日未定";
      if (YEAR_MONTH_ONLY.test(p.releaseDate)) {
        return yearMonthFormatter.format(new Date(`${p.releaseDate}-01`));
      }
      return dateFormatter.format(new Date(p.releaseDate));
    },
  },
  { label: "参考価格", render: (p) => priceFormatter.format(p.price) },
  {
    label: "総合評価",
    render: (p) => (p.rating !== null ? `${p.rating.toFixed(1)} / 5.0` : "評価未定"),
  },
  { label: "特徴タグ", render: (p) => p.tags.join(" / ") },
];

export function SpecTable({ product }: { product: Product }) {
  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-border">
      <table className="w-full text-sm">
        <tbody>
          {SPEC_ROWS.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="w-32 shrink-0 bg-muted/50 px-4 py-3 text-left align-top font-medium text-muted-foreground sm:w-40"
              >
                {row.label}
              </th>
              <td className="px-4 py-3">{row.render(product)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
