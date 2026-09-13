import { CategoryGrid } from "@/components/home/category-grid";
import { RankingList } from "@/components/home/ranking-list";
import { SearchPanel } from "@/components/home/search-panel";
import { getManufacturers, getManufacturersByCategory, getRankedProducts } from "@/lib/products";

export default function Home() {
  const rankedProducts = getRankedProducts(10);
  const manufacturers = getManufacturers();
  const manufacturersByCategory = getManufacturersByCategory();

  return (
    <>
      <CategoryGrid />
      <SearchPanel
        manufacturers={manufacturers}
        manufacturersByCategory={manufacturersByCategory}
      />
      <RankingList products={rankedProducts} />
    </>
  );
}
