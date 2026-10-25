import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { CATEGORY_GUIDES } from "@/lib/category-guides";
import { getAllProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const products = getAllProducts();

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // カテゴリ別選び方ハブページ（/categories/[slug]）
  // desktopはlaptop（パソコンの選び方）へ統合されるためCATEGORY_GUIDESのキーのみ登録
  const categoryHubPages: MetadataRoute.Sitemap = Object.keys(CATEGORY_GUIDES).map((slug) => ({
    url: `${SITE_URL}/categories/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // カテゴリ絞り込みページ（/search?category=xxx）
  const categorySearchPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${SITE_URL}/search?category=${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 商品詳細ページ
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryHubPages, ...categorySearchPages, ...productPages];
}

