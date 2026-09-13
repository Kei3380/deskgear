import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

import type { Product, ProductStatus } from "@/types/product";

const PRODUCTS_DIRECTORY = path.join(process.cwd(), "content", "products");

type ProductFrontmatter = {
  id: string;
  status: ProductStatus;
  title: string;
  manufacturer: string;
  release_date: string | null;
  category: string;
  price: number;
  rating: number | null;
  tags: string[];
  pros: string[];
  cons: string[];
  affiliate_links: {
    amazon: string;
    rakuten: string;
  };
  image: string;
};

function toProduct(slug: string, data: ProductFrontmatter): Product {
  return {
    slug,
    id: data.id,
    status: data.status,
    title: data.title,
    manufacturer: data.manufacturer,
    releaseDate: data.release_date ? String(data.release_date) : null,
    category: data.category,
    price: data.price,
    rating: data.rating ?? null,
    tags: data.tags ?? [],
    pros: data.pros ?? [],
    cons: data.cons ?? [],
    affiliateLinks: {
      amazon: data.affiliate_links?.amazon ?? "",
      rakuten: data.affiliate_links?.rakuten ?? "",
    },
    image: data.image ?? "",
  };
}

function getProductSlugs(): string[] {
  if (!fs.existsSync(PRODUCTS_DIRECTORY)) return [];
  return fs
    .readdirSync(PRODUCTS_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}

/**
 * 一覧・ランキング表示用に、公開中（status: "published"）の商品のFrontmatterのみを取得する
 * （本文は変換しない）。下書き・アーカイブ済み商品はサイト上に一切表示しない。
 */
export function getAllProducts(): Product[] {
  return getProductSlugs()
    .map((slug) => {
      const fullPath = path.join(PRODUCTS_DIRECTORY, `${slug}.md`);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return toProduct(slug, data as ProductFrontmatter);
    })
    .filter((product) => product.status === "published");
}

/**
 * 商品詳細ページ用に、Frontmatterと本文（HTML変換済み）を取得する。
 * 下書き・アーカイブ済み商品は、URLを直接指定されても404として扱う。
 */
export async function getProductBySlug(
  slug: string
): Promise<{ product: Product; contentHtml: string } | null> {
  const fullPath = path.join(PRODUCTS_DIRECTORY, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const product = toProduct(slug, data as ProductFrontmatter);
  if (product.status !== "published") return null;

  const processedContent = await remark().use(remarkHtml).process(content);

  return {
    product,
    contentHtml: processedContent.toString(),
  };
}

/** 評価が高い順の比較関数。評価未定（null）は最下位に扱う。 */
function compareRatingDesc(a: Product, b: Product): number {
  if (a.rating === null) return b.rating === null ? 0 : 1;
  if (b.rating === null) return -1;
  return b.rating - a.rating;
}

export function getRankedProducts(limit?: number): Product[] {
  const sorted = getAllProducts().sort(compareRatingDesc);
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export type SortOption = "price_asc" | "price_desc" | "rating_desc" | "release_desc";

export const SORT_OPTIONS: SortOption[] = [
  "price_asc",
  "price_desc",
  "rating_desc",
  "release_desc",
];

export type ProductFilters = {
  category?: string;
  manufacturer?: string;
  sort?: SortOption;
};

/**
 * 検索パネルのメーカー選択肢用に、公開中の商品からユニークなメーカー名一覧を取得する（50音順）。
 */
export function getManufacturers(): string[] {
  const manufacturers = new Set(getAllProducts().map((product) => product.manufacturer));
  return Array.from(manufacturers).sort((a, b) => a.localeCompare(b, "ja"));
}

/**
 * 検索パネルで「カテゴリ」選択時にメーカー選択肢を絞り込むための、カテゴリ別メーカー一覧マップ。
 * キーはカテゴリslug、値はそのカテゴリの公開中商品に登場するメーカー名一覧（50音順）。
 */
export function getManufacturersByCategory(): Record<string, string[]> {
  const byCategory = new Map<string, Set<string>>();
  for (const product of getAllProducts()) {
    if (!byCategory.has(product.category)) byCategory.set(product.category, new Set());
    byCategory.get(product.category)!.add(product.manufacturer);
  }
  return Object.fromEntries(
    Array.from(byCategory.entries()).map(([category, manufacturers]) => [
      category,
      Array.from(manufacturers).sort((a, b) => a.localeCompare(b, "ja")),
    ])
  );
}

/**
 * 検索結果ページ向けに、商品一覧を条件で絞り込み・並び替えする。
 */
export function filterAndSortProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  const filtered = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.manufacturer && product.manufacturer !== filters.manufacturer) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (filters.sort) {
    case "price_asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "rating_desc":
      sorted.sort(compareRatingDesc);
      break;
    case "release_desc":
      // 発売日未定（null）は「発売日が新しい順」で最上位に扱う。
      sorted.sort((a, b) => {
        if (a.releaseDate === null) return b.releaseDate === null ? 0 : -1;
        if (b.releaseDate === null) return 1;
        return a.releaseDate < b.releaseDate ? 1 : -1;
      });
      break;
    case "price_desc":
    default:
      sorted.sort((a, b) => b.price - a.price);
      break;
  }
  return sorted;
}
