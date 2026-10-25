import Link from "next/link";
import { ArrowRight, BookOpen, Compass, Laptop, Monitor, Mouse, Usb } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { CATEGORY_GUIDES } from "@/lib/category-guides";

const FEATURED_SLUGS = ["laptop", "monitor", "mouse", "accessory"] as const;

const GUIDE_ICONS = {
  laptop: Laptop,
  monitor: Monitor,
  mouse: Mouse,
  accessory: Usb,
};

export function FeaturedGuides() {
  return (
    <section aria-labelledby="featured-guides-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <SectionHeading id="featured-guides-heading" icon={Compass}>
          注目の選び方・比較完全ガイド
        </SectionHeading>
        <p className="text-xs text-muted-foreground sm:text-sm">
          スペックや予算で迷わないために。編集部が用途・環境別の重要基準をわかりやすく解説。
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURED_SLUGS.map((slug) => {
          const guide = CATEGORY_GUIDES[slug];
          if (!guide) return null;
          const Icon = GUIDE_ICONS[slug] ?? BookOpen;

          return (
            <article
              key={slug}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Icon className="size-3.5" aria-hidden />
                    {guide.categoryLabel}の選び方
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    2026年最新基準
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg">
                  <Link href={`/categories/${slug}`} className="focus:outline-hidden">
                    {guide.headline}
                  </Link>
                </h3>

                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {guide.intro}
                </p>

                {/* 代表的な重要基準バッジ */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {guide.guidePoints.slice(0, 2).map((point) => (
                    <span
                      key={point.title}
                      className="rounded-lg bg-accent/60 px-2 py-0.5 text-[11px] font-medium text-accent-foreground"
                    >
                      ✓ {point.title.split("（")[0]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50">
                <Link
                  href={`/categories/${slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:underline sm:text-sm"
                >
                  {guide.categoryLabel}の選び方・おすすめ一覧を見る
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
