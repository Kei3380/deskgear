import { CategoryGrid } from "@/components/home/category-grid";
import { RankingList } from "@/components/home/ranking-list";
import { SearchPanel } from "@/components/home/search-panel";
import { BeginnerSet } from "@/components/home/beginner-set";
import { getAllProducts, getManufacturers, getManufacturersByCategory } from "@/lib/products";

export default function Home() {
  // getAllProducts() を1回呼び出して各コンポーネントへ渡す（ファイルI/O削減）
  const allProducts = getAllProducts();
  const rankedProducts = [...allProducts]
    .sort((a, b) => {
      if (a.rating === null) return b.rating === null ? 0 : 1;
      if (b.rating === null) return -1;
      return b.rating - a.rating;
    })
    .slice(0, 10);
  const manufacturers = getManufacturers();
  const manufacturersByCategory = getManufacturersByCategory();

  return (
    <>
      <BeginnerSet products={allProducts} />
      <CategoryGrid />
      <SearchPanel
        manufacturers={manufacturers}
        manufacturersByCategory={manufacturersByCategory}
      />
      <RankingList products={rankedProducts} />
    </>
  );
}
