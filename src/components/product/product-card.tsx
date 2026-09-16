import Image from "next/image";
import Link from "next/link";
import { ImageIcon, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

export function ProductCard({
  product,
  rank,
}: {
  product: Product;
  rank?: number;
}) {
  return (
    <Card className="relative overflow-visible">
      {rank !== undefined && (
        <Badge className="absolute -top-2 -left-2 h-7 w-7 justify-center rounded-full text-sm">
          {rank}
        </Badge>
      )}
      <CardContent className="flex flex-1 flex-col gap-3">
        <Link
          href={`/products/${product.slug}`}
          className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-contain"
            />
          ) : (
            <ImageIcon className="size-8 text-muted-foreground" />
          )}
        </Link>
        <div className="flex flex-col gap-1">
          <Link
            href={`/products/${product.slug}`}
            className="line-clamp-2 font-medium transition-colors hover:text-primary"
          >
            {product.title.replace(/[（(][^）)]*[）)]/g, "").trim()}
          </Link>
          <span className="text-xs text-muted-foreground">
            {product.manufacturer}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            {product.rating !== null ? (
              <>
                <Star className="size-4 fill-primary text-primary" />
                {product.rating.toFixed(1)}
              </>
            ) : (
              "評価未定"
            )}
          </span>
          <span className="font-semibold">
            {priceFormatter.format(product.price)}
          </span>
        </div>
        <div className="flex gap-2">
          {product.affiliateLinks.amazon && (
            <a
              href={product.affiliateLinks.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "cta", size: "sm" }), "flex-1")}
            >
              Amazonで見る
            </a>
          )}
          {product.affiliateLinks.rakuten && (
            <a
              href={product.affiliateLinks.rakuten}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "rakuten", size: "sm" }), "flex-1")}
            >
              楽天で見る
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
