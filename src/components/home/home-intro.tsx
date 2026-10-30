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

      <div className="relative flex flex-col gap-2 text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.45)]">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl sm:leading-tight">
          ”とりあえず”パソコンはなにを買えばいいですか？
          <br className="sm:hidden" />
          というパソコン＆便利な周辺機器選び。
        </h1>
        <p className="max-w-2xl text-sm text-white/90 sm:text-base">
          難しいことはわからないから、とりあえず損しないパソコンを選定しました。
        </p>

        {/* ファーストビューからのクイックナビゲーション */}
        <div className="mt-2 flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm font-semibold">
          <a
            href="#beginner-set"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1.5 text-white transition-all hover:bg-white hover:text-slate-900 shadow-sm"
          >
            🛍️ 初心者セット
          </a>
          <a
            href="#featured-guides-heading"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/80 backdrop-blur-md px-3.5 py-1.5 text-white transition-all hover:bg-primary shadow-sm"
          >
            📖 選び方ガイド特集
          </a>
          <a
            href="#category-heading"
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-white/90 transition-all hover:bg-white hover:text-slate-900 shadow-sm"
          >
            ⚡ カテゴリ一覧
          </a>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-white/80 pt-1">
          <Clock className="size-3.5" aria-hidden />
          最終更新日：{SITE_LAST_UPDATED_LABEL}
        </p>
      </div>
    </div>
  );
}
