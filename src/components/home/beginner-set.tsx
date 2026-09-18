import Image from "next/image";
import Link from "next/link";
import { PackageOpen, ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const priceFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

// セットを構成する商品スラッグと表示ラベル
const SET_ITEMS: {
  slug: string;
  role: string;
  roleEn: string;
  note?: string;
  imageSrc: string;
  imageAlt: string;
}[] = [
  {
    slug: "asus-vivobook-14-x1407ca",
    role: "ノートパソコン",
    roleEn: "Laptop",
    note: "Webカメラ内蔵・顔認証対応でビデオ会議もすぐ使えます",
    imageSrc: "/images/beginner-set/laptop.jpg",
    imageAlt: "ノートパソコンのイメージ",
  },
  {
    slug: "logicool-m240grd-mouse",
    role: "マウス",
    roleEn: "Mouse",
    note: "※ ノートPCにマウスは付属しません",
    imageSrc: "/images/beginner-set/mouse.jpg",
    imageAlt: "ワイヤレスマウスのイメージ",
  },
  {
    slug: "dell-e2425hm-monitor",
    role: "モニター（任意）",
    roleEn: "Sub Monitor",
    note: "画面が広がると、作業効率が格段に変わります",
    imageSrc: "/images/beginner-set/monitor.jpg",
    imageAlt: "23.8インチモニターのイメージ",
  },
];

// JSON-LD: ItemList 構造化データ（AIO / Google リッチリザルト対応）
function BeginnerSetJsonLd({ products }: { products: Product[] }) {
  const itemListElement = SET_ITEMS.map((item, index) => {
    const product = products.find((p) => p.slug === item.slug);
    if (!product) return null;
    return {
      "@type": "ListItem",
      position: index + 1,
      name: product.title,
      url: `https://deskgear.vercel.app/products/${product.slug}`,
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

// 個別商品カード
function SetItemCard({
  product,
  meta,
}: {
  product: Product;
  meta: (typeof SET_ITEMS)[number];
}) {
  const titleShort = product.title.replace(/[（(][^）)]*[）)]/g, "").trim();

  return (
    <div className="flex flex-col gap-3">
      {/* 商品イメージ */}
      <Link
        href={`/products/${product.slug}`}
        className="group relative block overflow-hidden rounded-xl bg-muted"
        style={{ aspectRatio: "1 / 1" }}
        aria-label={`${meta.role}の詳細ページへ`}
      >
        <Image
          src={meta.imageSrc}
          alt={meta.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* 役割バッジ */}
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
          {meta.role}
        </span>
      </Link>

      {/* 商品情報 */}
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold leading-snug">
          <Link
            href={`/products/${product.slug}`}
            className="transition-colors hover:text-primary"
          >
            {titleShort}
          </Link>
        </h3>
        <p className="text-xs text-muted-foreground">{product.manufacturer}</p>
        {meta.note && (
          <p className="text-xs text-muted-foreground/80 italic">{meta.note}</p>
        )}
        <p className="mt-1 text-base font-bold text-foreground">
          {priceFormatter.format(product.price)}
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-2">
        {product.affiliateLinks.amazon && (
          <a
            href={product.affiliateLinks.amazon}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(buttonVariants({ variant: "cta", size: "sm" }), "w-full")}
          >
            Amazonで見る
          </a>
        )}
        {product.affiliateLinks.rakuten && (
          <a
            href={product.affiliateLinks.rakuten}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(buttonVariants({ variant: "rakuten", size: "sm" }), "w-full")}
          >
            楽天で見る
          </a>
        )}
      </div>
    </div>
  );
}

// メインコンポーネント
export function BeginnerSet({ products }: { products: Product[] }) {
  const setProducts = SET_ITEMS.map((item) => ({
    meta: item,
    product: products.find((p) => p.slug === item.slug),
  })).filter((x): x is { meta: (typeof SET_ITEMS)[number]; product: Product } =>
    x.product !== undefined
  );

  if (setProducts.length === 0) return null;

  return (
    <section
      id="beginner-set"
      aria-labelledby="beginner-set-heading"
      className="scroll-mt-8"
    >
      <BeginnerSetJsonLd products={products} />

      {/* カード全体 */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md">
        {/* ヘッダー */}
        <div className="relative overflow-hidden bg-primary px-6 py-5">
          {/* 背景装飾 */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 80% 50%, white 0%, transparent 60%)",
            }}
          />
          <div className="relative flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white/90">
              <PackageOpen className="size-3.5" />
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
          {/* メインビジュアル */}
          <div className="relative mb-6 overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 7" }}>
            <Image
              src="/images/beginner-set/hero.jpg"
              alt="ノートパソコン・マウス・モニターがデスクに並んだセットアップのイメージ"
              fill
              priority
              sizes="(min-width: 1024px) 800px, 100vw"
              className="object-cover"
            />
          </div>

          {/* 商品カード 3列 */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {setProducts.map(({ meta, product }) => (
              <SetItemCard key={product.slug} product={product} meta={meta} />
            ))}
          </div>

          {/* フッター注記 */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
            <p>
              ※ 価格は楽天市場の参考価格です。変動する場合があります。
              <br className="hidden sm:inline" />
              ※ モニターはお好みで追加してください（なくてもノートPCで完結します）。
            </p>
            <Link
              href="/search?category=laptop"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              他のノートパソコンを探す
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
