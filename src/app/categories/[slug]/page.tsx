import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductCard } from "@/components/product/product-card";
import { CategoryHero } from "@/components/category/category-hero";
import { GuideSection } from "@/components/category/guide-section";
import { LaptopSizeVisual } from "@/components/category/laptop-size-visual";
import { PitfallsCard } from "@/components/category/pitfalls-card";
import { UseCaseTable } from "@/components/category/use-case-table";
import { CategoryFaq } from "@/components/category/category-faq";
import { CATEGORY_GUIDES } from "@/lib/category-guides";
import { buildCategoryHubJsonLd, jsonLdToScriptHtml } from "@/lib/json-ld";
import { getAllProducts } from "@/lib/products";

export async function generateStaticParams() {
  return Object.keys(CATEGORY_GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/categories/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  if (slug === "desktop") {
    const pcGuide = CATEGORY_GUIDES.laptop;
    return {
      title: pcGuide.metaTitle,
      description: pcGuide.metaDescription,
    };
  }

  const guide = CATEGORY_GUIDES[slug];
  if (!guide) return {};

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
}

export default async function CategoryHubPage(
  props: PageProps<"/categories/[slug]">
) {
  const { slug } = await props.params;
  // デスクトップの個別ガイドは作らず、パソコンの選び方（laptop）へ統合・転送
  if (slug === "desktop") {
    redirect("/categories/laptop");
  }

  const guide = CATEGORY_GUIDES[slug];
  if (!guide) notFound();

  // 当該カテゴリの全published商品を取得（パソコンの場合はノートPCとデスクトップ/ミニPCを合算）
  const allProducts = getAllProducts();
  const categoryProducts = allProducts
    .filter((p) =>
      slug === "laptop" ? p.category === "laptop" || p.category === "desktop" : p.category === slug
    )
    .sort((a, b) => {
      if (a.rating === null) return b.rating === null ? 0 : 1;
      if (b.rating === null) return -1;
      return b.rating - a.rating;
    });

  const jsonLd = buildCategoryHubJsonLd({
    categoryLabel: guide.categoryLabel,
    slug,
    description: guide.metaDescription,
    faqs: guide.faqs,
    products: categoryProducts,
  });

  return (
    <article className="flex flex-col gap-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdToScriptHtml(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: "トップ", href: "/" },
          { label: `${guide.categoryLabel}の選び方とおすすめ` },
        ]}
      />

      {/* ヒーロー（H1、リード文、件数） */}
      <CategoryHero guide={guide} productCount={categoryProducts.length} />

      {/* 選び方の重要3基準 */}
      <GuideSection
        categoryLabel={guide.categoryLabel}
        points={guide.guidePoints}
      />

      {/* ノートPCの画面サイズ直感比較ビジュアル（パソコンカテゴリのみ） */}
      {slug === "laptop" && <LaptopSizeVisual />}

      {/* 失敗しないためのNG条件・注意点 */}
      <PitfallsCard
        categoryLabel={guide.categoryLabel}
        pitfalls={guide.pitfalls}
      />

      {/* 用途・目的別スペック目安表 */}
      <UseCaseTable
        categoryLabel={guide.categoryLabel}
        useCases={guide.useCases}
      />

      {/* レビュー掲載商品一覧 */}
      <section aria-labelledby="products-heading" className="flex flex-col gap-6">
        <SectionHeading id="products-heading" icon={Sparkles}>
          厳選{guide.categoryLabel}のおすすめランキング一覧（全{categoryProducts.length}件）
        </SectionHeading>

        {categoryProducts.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                rank={idx + 1}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            現在このカテゴリの商品は順次追加中です。
          </div>
        )}
      </section>

      {/* よくある質問（FAQ） */}
      <CategoryFaq categoryLabel={guide.categoryLabel} faqs={guide.faqs} />
    </article>
  );
}
