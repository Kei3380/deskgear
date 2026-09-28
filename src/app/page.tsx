import { BackdropSection } from "@/components/home/backdrop-section";
import { CategoryGrid } from "@/components/home/category-grid";
import { DeskPhotoBackdrop, DotPatternBackdrop } from "@/components/home/home-backdrops";
import { RankingList } from "@/components/home/ranking-list";
import { SearchPanel } from "@/components/home/search-panel";
import { BeginnerSet } from "@/components/home/beginner-set";
import { HomeIntro } from "@/components/home/home-intro";
import { getAllProducts, getManufacturers, getManufacturersByCategory } from "@/lib/products";

// 背景②の上に載せるパネル（模様の上でも見出し・カードが読めるよう不透明の地色にする）
const PANEL_CLASS = "rounded-2xl bg-background p-4 shadow-xl sm:p-6";

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
  const categoryCounts = allProducts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      {/* 背景①: デスク写真を固定し、h1 と初心者セットのカードがその上をスクロールする */}
      <BackdropSection
        backdrop={<DeskPhotoBackdrop />}
        backdropHeight="65svh"
        className="bg-slate-900"
        contentClassName="px-4 pb-4 sm:px-8 sm:pb-8"
      >
        <HomeIntro productCount={allProducts.length} />
        <BeginnerSet products={allProducts} />
      </BackdropSection>
      {/* 背景②: CSSのドット模様を固定し、白いパネルがその上をスクロールする */}
      <BackdropSection
        backdrop={<DotPatternBackdrop />}
        className="bg-slate-900"
        contentClassName="flex flex-col gap-6 p-4 sm:gap-8 sm:p-8"
      >
        <div className={PANEL_CLASS}>
          <CategoryGrid counts={categoryCounts} />
        </div>
        <SearchPanel
          manufacturers={manufacturers}
          manufacturersByCategory={manufacturersByCategory}
        />
        <div className={PANEL_CLASS}>
          <RankingList products={rankedProducts} />
        </div>
      </BackdropSection>
    </>
  );
}
