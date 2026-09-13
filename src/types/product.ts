export type AffiliateLinks = {
  amazon: string;
  rakuten: string;
};

export type ProductStatus = "published" | "draft" | "archived";

/**
 * `/content/products/` 配下のMarkdown Frontmatterと対応する商品データモデル。
 * Frontmatterのキーはsnake_case（例: release_date, affiliate_links）だが、
 * パーサーでこの型（camelCase）に変換して扱う。
 */
export type Product = {
  slug: string;
  id: string;
  status: ProductStatus;
  title: string;
  manufacturer: string;
  /** 発売日未定の商品は `null`（例: 発売前の新商品）。 */
  releaseDate: string | null;
  category: string;
  price: number;
  /** 評価未定（例: 発売前・レビュー未実施の商品）は `null`。 */
  rating: number | null;
  tags: string[];
  pros: string[];
  cons: string[];
  affiliateLinks: AffiliateLinks;
  image: string;
};

export type Category = {
  slug: string;
  label: string;
};
