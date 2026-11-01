import {
  Clock,
  Headphones,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Webcam,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE_LAST_UPDATED_LABEL } from "@/lib/site";

// 背景に浮かぶガジェットアイコン。--parallax-to が大きいほど速く流れ、手前にあるように見える
// （固定背景の写真の上に載るため白系で表示）
const FLOATING_ICONS: { icon: LucideIcon; className: string }[] = [
  { icon: Monitor, className: "top-0 right-[6%] size-20 -rotate-6 text-white/15 [--parallax-to:-30px]" },
  { icon: Keyboard, className: "bottom-0 right-[22%] size-14 rotate-6 text-white/20 [--parallax-to:-70px]" },
  { icon: Mouse, className: "top-2 right-[32%] size-9 rotate-12 text-white/30 [--parallax-to:-110px] max-sm:hidden" },
  { icon: Headphones, className: "-bottom-4 right-[2%] size-12 rotate-12 text-white/20 [--parallax-to:-90px]" },
  { icon: Laptop, className: "top-1/2 right-[44%] size-10 -rotate-12 text-white/15 [--parallax-to:-50px] max-md:hidden" },
  { icon: Webcam, className: "-top-2 right-[18%] size-8 text-white/30 [--parallax-to:-130px] max-sm:hidden" },
];

/** トップページ最上部のリード（ページ唯一の h1）。固定背景（デスク写真）の上に白文字で表示する */
export function HomeIntro({ productCount }: { productCount: number }) {
  return (
    <div className="relative flex min-h-[45svh] flex-col justify-end overflow-x-clip pt-16 pb-4 sm:min-h-[55svh] sm:pb-8">
      {/* 装飾（読み上げ対象外・クリック不可） */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
        {FLOATING_ICONS.map(({ icon: Icon, className }, index) => (
          <Icon key={index} className={cn("parallax-scroll absolute", className)} strokeWidth={1.5} />
        ))}
      </div>

      <div className="relative flex flex-col gap-2.5 text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.45)]">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/95 ring-1 ring-white/25">
          ✨ 専門用語が分からなくても失敗しないデスク環境づくり
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
          難しいことは抜きで、とりあえず損しない。
          <br className="sm:hidden" />
          疲れとストレスをゼロにするパソコン選び。
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
          「どれを買えばいいか分からない」「買ってから端子が合わなかったらどうしよう」という迷いを解消。全{productCount}商品の中から、相性・静音性・3年使える実用性を満たした機器だけを厳選しました（当サイトはアフィリエイト収入のみで運営しており、個人情報は一切収集しません）。
        </p>

        {/* ファーストビューからのクイックナビゲーション */}
        <div className="mt-2 flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm font-semibold">
          <a
            href="#beginner-set"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-slate-900 transition-all hover:bg-white/90 shadow-md"
          >
            🛍️ 迷ったらこれ：失敗しない初心者3点セット
          </a>
          <a
            href="#featured-guides-heading"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/85 backdrop-blur-md px-3.5 py-2 text-white transition-all hover:bg-primary shadow-sm"
          >
            📖 3分でわかる選び方ガイド
          </a>
          <a
            href="#category-heading"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-md px-3.5 py-2 text-white/95 transition-all hover:bg-white hover:text-slate-900 shadow-sm"
          >
            ⚡ カテゴリから探す
          </a>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-white/80 pt-1">
          <Clock className="size-3.5" aria-hidden />
          最終更新日：{SITE_LAST_UPDATED_LABEL}（毎日データ更新・相性チェック済み）
        </p>
      </div>
    </div>
  );
}
