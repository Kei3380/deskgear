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
 * `<script type="application/ld+json">` へ安全に埋め込むためのJSON文字列化。
 * `</script>` によるタグの早期終了を防ぐため `<` をエスケープする。
 */
export function jsonLdToScriptHtml(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
