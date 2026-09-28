import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ListChecks, MessageSquareText, Scale } from "lucide-react";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { AffiliateCta } from "@/components/product/affiliate-cta";
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

  return {
    title: `${result.product.title} レビュー | DESKGEAR`,
    description: `${result.product.title}のスペック・メリット・デメリットを解説。`,
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
              label: categoryLabel ?? "商品一覧",
              href: categoryLabel ? `/search?category=${product.category}` : "/search",
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

      <div className="flex flex-col gap-4 rounded-2xl bg-accent/60 p-6 sm:p-8">
        <p className="text-center text-sm font-medium text-accent-foreground">
          気になった方はこちらから最新価格をチェック
        </p>
        <AffiliateCta links={product.affiliateLinks} />
      </div>

      <StickyCtaBar product={product} />
    </article>
  );
}
