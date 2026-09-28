import type { Metadata } from "next";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { SearchPanel } from "@/components/home/search-panel";
import { ActiveFilters } from "@/components/search/active-filters";
import { ProductGrid } from "@/components/search/product-grid";
import { CATEGORIES } from "@/lib/categories";
import {
  filterAndSortProducts,
  getAllProducts,
  getManufacturers,
  getManufacturersByCategory,
  SORT_OPTIONS,
  type SortOption,
} from "@/lib/products";
import { DEFAULT_SORT } from "@/lib/sort-options";

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isSortOption(value: string | undefined): value is SortOption {
  return SORT_OPTIONS.includes(value as SortOption);
}

type SearchConditions = {
  category?: string;
  categoryLabel?: string;
  manufacturer?: string;
  sort: SortOption;
};

/**
 * URLクエリを検証済みの検索条件に変換する。URLを直接書き換えて実在しないカテゴリslug・メーカー名
 * （またはそのカテゴリに存在しないメーカー）が渡された場合は「指定なし」として扱い、
 * 絞り込み・検索パネル・条件チップ・title の表示を一致させる（Selectが空欄になるのを防ぐ）。
 */
function resolveSearchConditions(
  searchParams: Record<string, string | string[] | undefined>
): SearchConditions {
  const categoryParam = firstParam(searchParams.category);
  const manufacturerParam = firstParam(searchParams.manufacturer);
  const sortParam = firstParam(searchParams.sort);

  const category = CATEGORIES.find((c) => c.slug === categoryParam);
  const availableManufacturers = category
    ? getManufacturersByCategory()[category.slug] ?? []
    : getManufacturers();
  const manufacturer =
    manufacturerParam && availableManufacturers.includes(manufacturerParam)
      ? manufacturerParam
      : undefined;

  return {
    category: category?.slug,
    categoryLabel: category?.label,
    manufacturer,
    sort: isSortOption(sortParam) ? sortParam : DEFAULT_SORT,
  };
}

/** 検証済みの検索条件からページ見出し（h1）・<title> 用の文言を組み立てる */
function buildSearchTitle({ categoryLabel, manufacturer }: SearchConditions): string {
  if (manufacturer && categoryLabel) return `${manufacturer}の${categoryLabel}一覧`;
  if (categoryLabel) return `${categoryLabel}の商品一覧`;
  if (manufacturer) return `${manufacturer}の商品一覧`;
  return "商品検索";
}

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const title = buildSearchTitle(resolveSearchConditions(await props.searchParams));

  return {
    title: `${title} | DESKGEAR`,
    description: `${title === "商品検索" ? "デスク周辺機器" : title.replace(/一覧$/, "")}を価格・評価・発売日で比較。編集部レビュー付きで、自分に合う1台がすぐ見つかります。`,
  };
}

export default async function SearchPage(props: PageProps<"/search">) {
  const conditions = resolveSearchConditions(await props.searchParams);
  const {
    category: categoryParam,
    categoryLabel,
    manufacturer: manufacturerParam,
    sort,
  } = conditions;

  const results = filterAndSortProducts(getAllProducts(), {
    category: categoryParam,
    manufacturer: manufacturerParam,
    sort,
  });

  const pageTitle = buildSearchTitle(conditions);

  return (
    <>
      <div className="flex flex-col gap-4">
        <Breadcrumb
          items={[
            { label: "トップ", href: "/" },
            ...(categoryLabel
              ? [{ label: "商品検索", href: "/search" }, { label: categoryLabel }]
              : [{ label: "商品検索" }]),
          ]}
        />
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            カテゴリ・メーカー・並び順を指定して、条件に合う商品を比較できます。
          </p>
        </div>
        {/* URL（検索条件）が変わったら内部stateを初期化するため key を付与 */}
        <SearchPanel
          key={`${categoryParam ?? ""}|${manufacturerParam ?? ""}|${sort}`}
          manufacturers={getManufacturers()}
          manufacturersByCategory={getManufacturersByCategory()}
          initialValues={{
            category: categoryParam,
            manufacturer: manufacturerParam,
            sort,
          }}
        />
      </div>
      <section aria-labelledby="search-results-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-4">
            <SectionHeading id="search-results-heading">検索結果</SectionHeading>
            <span className="text-sm text-muted-foreground">
              <span className="text-lg font-bold text-foreground tabular-nums">{results.length}</span> 件
            </span>
          </div>
          <ActiveFilters
            category={categoryParam}
            categoryLabel={categoryLabel}
            manufacturer={manufacturerParam}
            sort={sort}
          />
        </div>
        <ProductGrid products={results} />
      </section>
    </>
  );
}
