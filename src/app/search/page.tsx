import { SearchPanel } from "@/components/home/search-panel";
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
  const sort: SortOption = isSortOption(sortParam) ? sortParam : "price_desc";

  const results = filterAndSortProducts(getAllProducts(), {
    category: categoryParam,
    manufacturer: manufacturerParam,
    sort,
  });

  const categoryLabel = CATEGORIES.find((c) => c.slug === categoryParam)?.label;

  return (
    <>
      <SearchPanel
        manufacturers={getManufacturers()}
        manufacturersByCategory={getManufacturersByCategory()}
        initialValues={{
          category: categoryParam,
          manufacturer: manufacturerParam,
          sort,
        }}
      />
      <section aria-labelledby="search-results-heading" className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h1 id="search-results-heading" className="font-heading text-xl font-semibold">
            検索結果{categoryLabel ? `：${categoryLabel}` : ""}
          </h1>
          <span className="text-sm text-muted-foreground">{results.length}件</span>
        </div>
        <ProductGrid products={results} />
      </section>
    </>
  );
}
