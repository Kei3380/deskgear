import Image from "next/image";
import Link from "next/link";
import { ImageIcon } from "lucide-react";

import { Price } from "@/components/common/price";
import { Rating } from "@/components/common/rating";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { shortenTitle } from "@/lib/format";
import { toHighResImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

// 1〜3位は金・銀・銅、4位以降はプライマリカラーで表示する
const RANK_BADGE_CLASSES: Record<number, string> = {
  1: "bg-amber-400 text-amber-950 ring-amber-500/40",
  2: "bg-slate-300 text-slate-800 ring-slate-400/40",
  3: "bg-orange-300 text-orange-950 ring-orange-400/40",
};

function RankBadge({ rank }: { rank: number }) {
  return (
    <span
      className={cn(
        "absolute top-2 left-2 z-10 flex size-8 items-center justify-center overflow-hidden rounded-full text-sm font-bold shadow-sm ring-2",
        RANK_BADGE_CLASSES[rank] ?? "bg-primary text-primary-foreground ring-primary/30"
      )}
      aria-label={`${rank}位`}
    >
      {rank <= 3 && (
        <span
          aria-hidden
          className="rank-shine pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />
      )}
      <span className="relative">{rank}</span>
    </span>
  );
}

export function ProductCard({
  product,
  rank,
}: {
  product: Product;
  rank?: number;
}) {
  return (
    <Card className="transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex flex-1 flex-col gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-white ring-1 ring-border/60"
        >
          {rank !== undefined && <RankBadge rank={rank} />}
          {product.image ? (
            <Image
              src={toHighResImage(product.image)}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <ImageIcon className="size-8 text-muted-foreground" />
          )}
        </Link>
        <div className="flex flex-col gap-1">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 min-h-[2lh] font-medium leading-snug transition-colors hover:text-primary"
          >
            {shortenTitle(product.title)}
          </Link>
          <span className="text-xs text-muted-foreground">
            {product.manufacturer}
          </span>
        </div>
        {/* 価格・CTAはカード下端に揃える（グリッド内で高さが揃うように） */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Rating rating={product.rating} />
            <Price price={product.price} className="text-lg" />
          </div>
          <div className="flex gap-2">
            {product.affiliateLinks.amazon && (
              <a
                href={product.affiliateLinks.amazon}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "cta", size: "sm" }), "h-9 flex-1")}
              >
                Amazonで見る
              </a>
            )}
            {product.affiliateLinks.rakuten && (
              <a
                href={product.affiliateLinks.rakuten}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "rakuten", size: "sm" }), "h-9 flex-1")}
              >
                楽天で見る
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
