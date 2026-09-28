import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import {
  Keyboard,
  Mouse,
  Monitor,
  Headphones,
  Webcam,
  Usb,
  Laptop,
  Computer,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { CATEGORIES } from "@/lib/categories";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  keyboard: Keyboard,
  mouse: Mouse,
  monitor: Monitor,
  headset: Headphones,
  webcam: Webcam,
  accessory: Usb,
  laptop: Laptop,
  desktop: Computer,
  security: ShieldCheck,
};

// 狭い画面でカテゴリ名が単語の途中で折り返さないよう、改行してよい位置を指定する（表示専用）。
// 表示名そのものは lib/categories.ts の CATEGORIES が正。ここにないカテゴリは通常どおり折り返す。
const LABEL_BREAKS: Record<string, string[]> = {
  desktop: ["デスクトップ", "パソコン"],
  laptop: ["ノート", "パソコン"],
  headset: ["ヘッド", "セット"],
  webcam: ["Web", "カメラ"],
  accessory: ["PC", "アクセサリ"],
};

function CategoryLabel({ slug, label }: { slug: string; label: string }) {
  const parts = LABEL_BREAKS[slug];
  // 分割結果が表示名と一致しない（CATEGORIES 側が変更された）場合は分割せずそのまま表示する
  if (!parts || parts.join("") !== label) return <>{label}</>;
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={part}>
          {i > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </>
  );
}

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <section aria-labelledby="category-heading">
      <SectionHeading id="category-heading" className="mb-4">
        カテゴリから探す
      </SectionHeading>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3 md:grid-cols-6">
        {CATEGORIES.map((category, index) => {
          const Icon = CATEGORY_ICONS[category.slug] ?? Keyboard;
          // reveal（translate を使う）は hover の浮き上がりと競合するため、ラッパー側に付与する
          const revealStyle = { "--reveal-stagger": `${(index % 6) * 8}%` } as CSSProperties;
          return (
            <div key={category.slug} className="reveal" style={revealStyle}>
              <Link
                href={`/search?category=${category.slug}`}
                className="group flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card px-2 py-3 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:p-4"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5 motion-safe:group-hover:animate-wiggle" aria-hidden />
                </span>
                {/* keep-all で <wbr> の位置でのみ改行。それでも収まらない場合は anywhere で折り返してはみ出しを防ぐ */}
                <span className="text-[11px] font-medium leading-snug [overflow-wrap:anywhere] [word-break:keep-all] sm:text-sm">
                  <CategoryLabel slug={category.slug} label={category.label} />
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {counts[category.slug] ?? 0}件
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
