import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

export function RankingList({ products }: { products: Product[] }) {
  const top10 = products.slice(0, 10);

  return (
    <section aria-labelledby="ranking-heading">
      <h2 id="ranking-heading" className="mb-4 font-heading text-xl font-semibold">
        総合おすすめランキング ベスト10
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {top10.map((product, index) => (
          <ProductCard key={product.slug} product={product} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
