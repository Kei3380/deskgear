import { CATEGORIES } from "@/lib/categories";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Product } from "@/types/product";

/**
 * 要件定義 6章「SEO / AIO対策」に基づき、商品詳細ページ用の構造化データ（Product + Reviewスキーマ）を生成する。
 * 検索エンジン・AIクローラー（SGE, Perplexity等）が商品情報・評価を正しく解釈できるようにする。
 */
export function buildProductJsonLd(product: Product) {
  const categoryLabel =
    CATEGORIES.find((c) => c.slug === product.category)?.label ?? product.category;
  const canonicalUrl = `${SITE_URL}/products/${product.slug}`;
  const offerUrl = product.affiliateLinks.amazon || product.affiliateLinks.rakuten || canonicalUrl;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: `${product.title}のスペック・メリット・デメリットを解説。`,
    sku: product.id,
    category: categoryLabel,
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: product.manufacturer,
    },
    offers: {
      "@type": "Offer",
      url: offerUrl,
      price: product.price,
      priceCurrency: "JPY",
    },
    // 評価未定（rating: null）の商品はratingValueを持てないためreviewを出力しない
    ...(product.rating !== null && {
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: product.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          "@type": "Organization",
          name: SITE_NAME,
        },
      },
    }),
  };
}

/**
 * トップページ用の構造化データ（WebSiteスキーマ）を生成する。
 * Google等の検索エンジンがサイト名（DESKGEAR）およびサイトの概要を正確に理解できるようにする。
 */
export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["デスクギア", "DESK GEAR"],
    url: SITE_URL,
    description:
      "パソコン選びから始まる、理想のワークスペースづくり。暮らしや作業スタイルに寄り添うノートPCと、心地よい周辺機器のトータルコーディネートをご提案します。",
  };
}

/**
 * カテゴリ別ハブページ（/categories/[slug]）用の構造化データ（CollectionPage + ItemList + FAQPage）を生成する。
 * Google検索結果でのFAQリッチリザルトおよびコレクション表示を狙う。
 */
export function buildCategoryHubJsonLd({
  categoryLabel,
  slug,
  description,
  faqs,
  products,
}: {
  categoryLabel: string;
  slug: string;
  description: string;
  faqs: { question: string; answer: string }[];
  products: Product[];
}) {
  const pageUrl = `${SITE_URL}/categories/${slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `【2026年最新】${categoryLabel}おすすめの選び方と厳選モデル`,
        description,
        isPartOf: {
          "@type": "WebSite",
          "@id": SITE_URL,
          name: SITE_NAME,
        },
      },
      {
        "@type": "ItemList",
        name: `${categoryLabel}おすすめ商品一覧`,
        numberOfItems: products.length,
        itemListElement: products.slice(0, 15).map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: p.title,
          url: `${SITE_URL}/products/${p.slug}`,
        })),
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };
}

/**
 * `<script type="application/ld+json">` へ安全に埋め込むためのJSON文字列化。
 * `</script>` によるタグの早期終了を防ぐため `<` をエスケープする。
 */
export function jsonLdToScriptHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
