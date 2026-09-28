import type { SortOption } from "@/lib/products";

/**
 * 並び替えの表示ラベル。検索パネル（クライアント）と検索結果ページ（サーバー）の両方で使うため、
 * fs に依存する `products.ts` とは別ファイルに置く。配列の順序がセレクトの表示順。
 */
export const SORT_OPTION_ITEMS: { value: SortOption; label: string }[] = [
  { value: "price_desc", label: "価格が高い順" },
  { value: "price_asc", label: "価格が安い順" },
  { value: "rating_desc", label: "評価が高い順" },
  { value: "release_desc", label: "発売日が新しい順" },
];

export const SORT_LABELS = Object.fromEntries(
  SORT_OPTION_ITEMS.map((o) => [o.value, o.label])
) as Record<SortOption, string>;

export const DEFAULT_SORT: SortOption = "price_desc";
