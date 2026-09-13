import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ImageIcon, Star } from "lucide-react";

import { AffiliateCta } from "@/components/product/affiliate-cta";
import { ProsConsTable } from "@/components/product/pros-cons-table";
import { SpecTable } from "@/components/product/spec-table";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/categories";
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

      <Link
        href={`/search?category=${product.category}`}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← {categoryLabel ?? "商品一覧"}に戻る
      </Link>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
            />
          ) : (
            <ImageIcon className="size-12 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col justify-center gap-3">
          {categoryLabel && <Badge variant="secondary">{categoryLabel}</Badge>}
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            {product.title}
          </h1>
          <p className="text-sm text-muted-foreground">{product.manufacturer}</p>
          <div className="flex items-center gap-1 text-sm">
            {product.rating !== null ? (
              <>
                <Star className="size-4 fill-primary text-primary" />
                <span className="font-medium">{product.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">/ 5.0</span>
              </>
            ) : (
              <span className="text-muted-foreground">評価未定</span>
            )}
          </div>
          <AffiliateCta links={product.affiliateLinks} />
        </div>
      </div>

      <section aria-labelledby="spec-heading" className="flex flex-col gap-3">
        <h2 id="spec-heading" className="font-heading text-xl font-semibold">
          スペック
        </h2>
        <SpecTable product={product} />
      </section>

      <section aria-labelledby="pros-cons-heading" className="flex flex-col gap-3">
        <h2 id="pros-cons-heading" className="font-heading text-xl font-semibold">
          メリット・デメリット
        </h2>
        <ProsConsTable product={product} />
      </section>

      <section
        aria-labelledby="review-heading"
        className="flex flex-col gap-3 [&_h2]:mt-2 [&_h2]:font-heading [&_h2]:text-lg [&_h2]:font-semibold [&_li]:leading-relaxed [&_p]:leading-relaxed [&_p]:text-foreground/90 [&_ul]:list-disc [&_ul]:pl-5"
      >
        <h2 id="review-heading" className="font-heading text-xl font-semibold">
          レビュー
        </h2>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </section>

      <div className="rounded-lg bg-card p-6 ring-1 ring-border">
        <p className="mb-4 text-center text-sm text-muted-foreground">
          気になった方はこちらから最新価格をチェック
        </p>
        <AffiliateCta links={product.affiliateLinks} />
      </div>
    </article>
  );
}
