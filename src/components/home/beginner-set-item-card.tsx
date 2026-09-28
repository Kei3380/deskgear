import Image from "next/image";
import Link from "next/link";

import { Price } from "@/components/common/price";
import { buttonVariants } from "@/components/ui/button";
import { shortenTitle } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import type { BeginnerSetItem } from "./beginner-set-items";

// 初心者セット内の個別商品カード
export function BeginnerSetItemCard({
  product,
  meta,
}: {
  product: Product;
  meta: BeginnerSetItem;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* 商品イメージ */}
      <Link
        href={`/products/${product.slug}`}
        className="group relative block aspect-[4/3] overflow-hidden rounded-xl bg-muted"
        aria-label={`${meta.role}の詳細ページへ`}
      >
        <Image
          src={meta.imageSrc}
          alt={meta.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* 役割バッジ（任意品は控えめな白地で区別） */}
        <span
          className={cn(
            "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold shadow",
            meta.optional
              ? "bg-white/90 text-muted-foreground ring-1 ring-border"
              : "bg-primary/90 text-primary-foreground"
          )}
        >
          {meta.role}
        </span>
      </Link>

      {/* 商品情報 */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug">
          <Link href={`/products/${product.slug}`} className="transition-colors hover:text-primary">
            {shortenTitle(product.title)}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">{product.manufacturer}</p>
        {meta.note && <p className="text-xs text-muted-foreground/80 italic">{meta.note}</p>}
      </div>

      {/* 価格・CTA（カード下端に揃える） */}
      <div className="mt-auto flex flex-col gap-2">
        <Price price={product.price} className="text-xl" />
        {product.affiliateLinks.amazon && (
          <a
            href={product.affiliateLinks.amazon}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(buttonVariants({ variant: "cta", size: "sm" }), "h-auto w-full py-2.5")}
          >
            Amazonで見る
          </a>
        )}
        {product.affiliateLinks.rakuten && (
          <a
            href={product.affiliateLinks.rakuten}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(buttonVariants({ variant: "rakuten", size: "sm" }), "h-auto w-full py-2.5")}
          >
            楽天で見る
          </a>
        )}
      </div>
    </div>
  );
}
