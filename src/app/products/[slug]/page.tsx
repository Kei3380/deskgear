import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Compass, ListChecks, MessageSquareText, Scale, Sparkles } from "lucide-react";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { AffiliateCta } from "@/components/product/affiliate-cta";
import { ProductCard } from "@/components/product/product-card";
import { ProductHero } from "@/components/product/product-hero";
import { ProsConsTable } from "@/components/product/pros-cons-table";
import { SpecTable } from "@/components/product/spec-table";
import { StickyCtaBar } from "@/components/product/sticky-cta-bar";
import { CATEGORIES } from "@/lib/categories";
import { shortenTitle } from "@/lib/format";
import { buildProductJsonLd, jsonLdToScriptHtml } from "@/lib/json-ld";
import { getAllProducts, getProductBySlug } from "@/lib/products";

export async function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const result = await getProductBySlug(slug);
  if (!result) return {};

  const { product } = result;
  const shortTitle = shortenTitle(product.title);
  const firstPro = product.pros?.[0] ? `「${product.pros[0]}」` : "";
  const firstCon = product.cons?.[0] ? `注意点「${product.cons[0]}」` : "デメリット";

  return {
    title: `【デメリット・評判は？】${shortTitle}のメリットと在宅ワークでの使い心地をレビュー`,
    description: `${firstPro}が特徴の${shortTitle}。実際の使い心地や購入前に知るべき${firstCon}、スペック詳細を分かりやすく解説。`,
  };
}

export default async function ProductDetailPage(
  props: PageProps<"/products/[slug]">
) {
  const { slug } = await props.params;
  const result = await getProductBySlug(slug);
  if (!result) notFound();

  const { product, contentHtml } = result;
  const categoryLabel = CATEGORIES.find((c) => c.slug === product.category)?.label;
  const productJsonLd = buildProductJsonLd(product);

  // 同カテゴリの関連おすすめ商品（自商品を除く最大3件）
  const allProducts = getAllProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .sort((a, b) => {
      if (a.rating === null) return b.rating === null ? 0 : 1;
      if (b.rating === null) return -1;
      return b.rating - a.rating;
    })
    .slice(0, 3);

  return (
    <article className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScriptHtml(productJsonLd) }}
      />

      <div className="flex flex-col gap-4">
        <Breadcrumb
          items={[
            { label: "トップ", href: "/" },
            {
              label: categoryLabel ? `${categoryLabel}の選び方` : "商品一覧",
              href: categoryLabel ? `/categories/${product.category}` : "/search",
            },
            { label: shortenTitle(product.title) },
          ]}
        />
        <ProductHero product={product} categoryLabel={categoryLabel} />
      </div>

      <section aria-labelledby="spec-heading" className="flex flex-col gap-3">
        <SectionHeading id="spec-heading" icon={ListChecks}>スペック</SectionHeading>
        <SpecTable product={product} />
      </section>

      <section aria-labelledby="pros-cons-heading" className="flex flex-col gap-3">
        <SectionHeading id="pros-cons-heading" icon={Scale}>メリット・デメリット</SectionHeading>
        <ProsConsTable product={product} />
      </section>

      <section aria-labelledby="review-heading" className="flex flex-col gap-3">
        <SectionHeading id="review-heading" icon={MessageSquareText}>編集部レビュー</SectionHeading>
        {/* Markdown本文。@tailwindcss/typography を使わず任意セレクタで最低限の本文スタイルを当てる */}
        <div
          className="rounded-2xl bg-card p-5 ring-1 ring-border sm:p-8 [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:border-l-4 [&_h2]:border-primary [&_h2]:pl-3 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:leading-relaxed [&_li+li]:mt-1.5 [&_p]:leading-loose [&_p]:text-foreground/90 [&_p+p]:mt-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:marker:text-primary"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </section>

      {/* 最新価格CTA */}
      <div className="flex flex-col gap-4 rounded-2xl bg-accent/60 p-6 sm:p-8">
        <p className="text-center text-sm font-medium text-accent-foreground">
          気になった方はこちらから最新価格をチェック
        </p>
        <AffiliateCta links={product.affiliateLinks} />
      </div>

      {/* カテゴリ選び方ハブへの戻り導線 */}
      {categoryLabel && (
        <div className="flex flex-col gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Compass className="size-4" aria-hidden />
              {categoryLabel}選びに迷ったら
            </span>
            <p className="text-sm font-bold text-foreground">
              {categoryLabel}の失敗しない選び方・スペック基準ガイドを見る
            </p>
          </div>
          <Link
            href={`/categories/${product.category}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
          >
            選び方ガイドへ
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      )}

      {/* 同カテゴリの関連おすすめ商品 */}
      {relatedProducts.length > 0 && (
        <section aria-labelledby="related-heading" className="flex flex-col gap-4">
          <SectionHeading id="related-heading" icon={Sparkles}>
            あわせて比較したい注目の{categoryLabel ?? "周辺機器"}
          </SectionHeading>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      <StickyCtaBar product={product} />
    </article>
  );
}

