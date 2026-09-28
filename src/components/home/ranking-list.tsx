import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

export function RankingList({ products }: { products: Product[] }) {
  const top10 = products.slice(0, 10);

  return (
    <section id="ranking" aria-labelledby="ranking-heading">
      <div className="mb-4 flex items-end justify-between gap-4">
        <SectionHeading id="ranking-heading" icon={Trophy}>
          総合おすすめランキング ベスト10
        </SectionHeading>
        <Link
          href="/search?sort=rating_desc"
          className="inline-flex shrink-0 items-center gap-1 text-sm text-primary hover:underline"
        >
          すべて見る
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {top10.map((product, index) => (
          <ProductCard key={product.slug} product={product} rank={index + 1} />
        ))}
      </div>
    </section>
  );
}
