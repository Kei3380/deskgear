import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, PackageOpen, Sparkles } from "lucide-react";

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
    name: "おすすめセット",
    description:
      "パソコン環境を最安値水準で揃えるおすすめ3点セット。ノートパソコン・マウス・モニターのセット。",
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

      {/* カード全体（パララックスの view() を妨げないよう overflow-hidden ではなく overflow-clip） */}
      <div className="overflow-clip rounded-2xl border border-border bg-card shadow-md">
        {/* ヘッダー */}
        <div className="relative overflow-hidden bg-primary px-6 py-5">
          {/* 背景装飾 */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,white_0%,transparent_60%)] opacity-10" />
          <div className="relative flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white/95">
                <PackageOpen className="size-3.5" aria-hidden />
                迷ったらこの3点
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/30">
                <CheckCircle2 className="size-3.5" aria-hidden />
                相性確認済み・変換アダプタ不要
              </span>
            </div>
            <div>
              <h2
                id="beginner-set-heading"
                className="font-heading text-xl font-bold text-white [overflow-wrap:anywhere] [word-break:keep-all] sm:text-2xl"
              >
                {/* 狭い画面で「セッ／ト」のように途中改行しないよう、語の切れ目でのみ改行する */}
                パソコン初心者<wbr />おすすめセット
              </h2>
              <p className="mt-1 text-sm text-white/90">
                全{products.length}商品から「初期不良リスクが低く・設定不要ですぐ繋がり・3年間快適に使える」基準をクリアした3点だけを選抜しました。
              </p>
            </div>
          </div>
        </div>

        {/* ボディ */}
        <div className="p-5 sm:p-6">
          {/* 対象者の明確化（達成の確かさ・誠実さ） */}
          <div className="mb-6 grid grid-cols-1 gap-3 rounded-xl border border-border bg-muted/40 p-4 text-xs sm:grid-cols-2 sm:text-sm">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden />
              <div>
                <p className="font-semibold text-foreground">このセットで大満足できる人</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  Zoom会議・Office資料作成・ネット検索・動画視聴が中心の人（これ以上の高価なスペックはオーバースペックになり損をします）
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
              <div>
                <p className="font-semibold text-foreground">別モデルを選んだ方がいい人</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  本格的な3Dゲームや4K動画編集をする人（専用グラフィック搭載の上位モデルをおすすめします）
                </p>
              </div>
            </div>
          </div>

          {/* 商品カード 3列 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
            {entries.map(({ meta, product }) => (
              <BeginnerSetItemCard key={product.slug} product={product} meta={meta} />
            ))}
          </div>

          <SetTotal entries={entries} />

          {/* 届いてからの時間・手間を最小化する3ステップ案内 */}
          <div className="mt-4 rounded-xl border border-border/80 bg-background px-4 py-3.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground sm:text-sm">
              <Sparkles className="size-4 text-primary" aria-hidden />
              届いてから約5分で使い始められます（難しい配線・ドライバ設定は一切不要）
            </p>
            <ol className="mt-2 grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
              <li className="rounded-lg bg-muted/50 px-3 py-2">
                <span className="font-semibold text-foreground">Step 1.</span> PCを開いて画面の案内通りに初期ログイン（顔認証対応）
              </li>
              <li className="rounded-lg bg-muted/50 px-3 py-2">
                <span className="font-semibold text-foreground">Step 2.</span> マウスの電源を入れてBluetooth接続（USB端子を塞ぎません）
              </li>
              <li className="rounded-lg bg-muted/50 px-3 py-2">
                <span className="font-semibold text-foreground">Step 3.</span> モニターは付属HDMIケーブル1本をPCに挿すだけで2画面化完了
              </li>
            </ol>
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
