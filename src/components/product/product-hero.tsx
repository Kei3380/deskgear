import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { Price } from "@/components/common/price";
import { Rating } from "@/components/common/rating";
import { AffiliateCta } from "@/components/product/affiliate-cta";
import { Badge } from "@/components/ui/badge";
import { toHighResImage } from "@/lib/images";
import type { Product } from "@/types/product";

/** 商品詳細ページのファーストビュー（画像・商品名・評価・価格・CTA） */
export function ProductHero({
  product,
  categoryLabel,
}: {
  product: Product;
  categoryLabel?: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-white ring-1 ring-border sm:aspect-[4/3] md:aspect-square">
        {product.image ? (
          <Image
            src={toHighResImage(product.image)}
            alt={product.title}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain p-6"
          />
        ) : (
          <ImageIcon className="size-12 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-2">
          {categoryLabel && (
            <Badge variant="secondary" className="w-fit">
              {categoryLabel}
            </Badge>
          )}
          <h1 className="font-heading text-2xl font-bold leading-snug sm:text-3xl">
            {product.title}
          </h1>
          <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 border-y border-border py-4">
          <Rating rating={product.rating} showMax className="text-base" />
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">参考価格</span>
            <Price price={product.price} className="text-3xl" />
          </div>
        </div>

        {product.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="特徴タグ">
            {product.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline">{tag}</Badge>
              </li>
            ))}
          </ul>
        )}

        <AffiliateCta links={product.affiliateLinks} />
        <p className="text-xs text-muted-foreground">
          ※ 価格は参考価格です。最新の価格・在庫は各ショップでご確認ください。
        </p>
      </div>
    </div>
  );
}
