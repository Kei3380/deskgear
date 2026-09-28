import Link from "next/link";
import { SearchX } from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/types/product";

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <SearchX className="size-6" aria-hidden />
      </span>
      <p className="font-medium">条件に合う商品が見つかりませんでした</p>
      <p className="text-sm text-muted-foreground">メーカーやカテゴリの条件を変えて、再度お試しください。</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Link href="/search" className={buttonVariants({ variant: "default" })}>
          条件をクリアして全商品を見る
        </Link>
        <Link href="/#ranking" className={buttonVariants({ variant: "outline" })}>
          ランキングを見る
        </Link>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </div>
  );
}
