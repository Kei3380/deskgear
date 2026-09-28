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

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;

  const categoryParam = firstParam(searchParams.category);
  const manufacturerParam = firstParam(searchParams.manufacturer);
  const sortParam = firstParam(searchParams.sort);
  const sort: SortOption = isSortOption(sortParam) ? sortParam : DEFAULT_SORT;

  const results = filterAndSortProducts(getAllProducts(), {
    category: categoryParam,
    manufacturer: manufacturerParam,
    sort,
  });

  const categoryLabel = CATEGORIES.find((c) => c.slug === categoryParam)?.label;

  const pageTitle = categoryLabel ? `${categoryLabel}の商品一覧` : "商品検索";

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
