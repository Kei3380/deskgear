import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";

import { Price } from "@/components/common/price";
import { SITE_URL } from "@/lib/site";
import type { Product } from "@/types/product";
import { BeginnerSetItemCard } from "./beginner-set-item-card";
import { SET_ITEMS, type BeginnerSetItem } from "./beginner-set-items";

type SetEntry = { meta: BeginnerSetItem; product: Product };

// JSON-LD: ItemList 構造化データ（AIO / Google リッチリザルト対応）
function BeginnerSetJsonLd({ products }: { products: Product[] }) {
  const itemListElement = SET_ITEMS.map((item, index) => {
    const product = products.find((p) => p.slug === item.slug);
    if (!product) return null;
    return {
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: `${SITE_URL}/products/${product.slug}`,
    };
  }).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "パソコン初心者おすすめセット",
    description:
      "初めてのパソコン環境を最安値水準で揃えられるおすすめ3点セット。ノートパソコン・マウス・モニターのセット。",
    numberOfItems: itemListElement.length,
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// セット合計金額（必須品のみ / 任意品込み）
function SetTotal({ entries }: { entries: SetEntry[] }) {
  const required = entries.filter((e) => !e.meta.optional);
  const requiredTotal = required.reduce((sum, e) => sum + e.product.price, 0);
  const fullTotal = entries.reduce((sum, e) => sum + e.product.price, 0);
  const hasOptional = required.length < entries.length;

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl bg-accent/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">必要な{required.length}点の合計</span>
        <Price price={requiredTotal} className="text-2xl text-accent-foreground" />
      </div>
      {hasOptional && (
        <div className="flex flex-col sm:items-end">
          <span className="text-xs text-muted-foreground">モニター込み{entries.length}点の合計</span>
          <Price price={fullTotal} className="text-lg text-foreground/80" />
        </div>
      )}
    </div>
  );
}

// メインコンポーネント
export function BeginnerSet({ products }: { products: Product[] }) {
  const entries = SET_ITEMS.map((item) => ({
    meta: item,
    product: products.find((p) => p.slug === item.slug),
  })).filter((x): x is SetEntry => x.product !== undefined);

  if (entries.length === 0) return null;

  return (
    <section id="beginner-set" aria-labelledby="beginner-set-heading">
      <BeginnerSetJsonLd products={products} />

      {/* カード全体 */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
        {/* ヘッダー */}
        <div className="relative overflow-hidden bg-primary px-6 py-5">
          {/* 背景装飾 */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,white_0%,transparent_60%)] opacity-10" />
          <div className="relative flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white/90">
              <PackageOpen className="size-3.5" aria-hidden />
              初心者向けセット
            </span>
            <div>
              <h2
                id="beginner-set-heading"
                className="font-heading text-xl font-bold text-white sm:text-2xl"
              >
                パソコン初心者おすすめセット
              </h2>
              <p className="mt-0.5 text-sm text-white/80">
                とりあえずこれで始めよう — 必要なものを最安値水準でまとめました
              </p>
            </div>
          </div>
        </div>

        {/* ボディ */}
        <div className="p-5 sm:p-6">
          {/* メインビジュアル（モバイルは高さを確保するため 16:9） */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-xl sm:aspect-[16/7]">
            <Image
              src="/images/beginner-set/hero.jpg"
              alt="ノートパソコン・マウス・モニターがデスクに並んだセットアップのイメージ"
              fill
              priority
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pt-10 pb-3 sm:px-6 sm:pb-5">
              <p className="font-heading text-base font-bold text-white sm:text-xl">
                この{entries.length}点で、今日から始められる
              </p>
            </div>
          </div>

          {/* 商品カード 3列 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
            {entries.map(({ meta, product }) => (
              <BeginnerSetItemCard key={product.slug} product={product} meta={meta} />
            ))}
          </div>

          <SetTotal entries={entries} />

          {/* フッター注記 */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <p>
              ※ 価格は楽天市場の参考価格です。変動する場合があります。
              <br className="hidden sm:inline" />
              ※ モニターはお好みで追加してください（なくてもノートPCで完結します）。
            </p>
            <Link
              href="/search?category=laptop"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              他のノートパソコンを探す
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
