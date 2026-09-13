import type { Category } from "@/types/product";

/**
 * トップページ・検索パネルに表示するカテゴリの表示名・並び順を管理する。
 * 各商品Markdownの `category` フィールドの値（slug）と対応させる。
 */
export const CATEGORIES: Category[] = [
  { slug: "desktop", label: "デスクトップパソコン" },
  { slug: "laptop", label: "ノートパソコン" },
  { slug: "monitor", label: "モニター" },
  { slug: "keyboard", label: "キーボード" },
  { slug: "mouse", label: "マウス" },
  { slug: "headset", label: "ヘッドセット" },
  { slug: "webcam", label: "Webカメラ" },
  { slug: "security", label: "セキュリティ" },
  { slug: "accessory", label: "PCアクセサリ" },
];
