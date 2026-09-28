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
const FLOATING_ICONS: { icon: LucideIcon; className: string }[] = [
  { icon: Monitor, className: "top-0 right-[6%] size-20 -rotate-6 text-primary/10 [--parallax-to:-30px]" },
  { icon: Keyboard, className: "bottom-0 right-[22%] size-14 rotate-6 text-primary/15 [--parallax-to:-70px]" },
  { icon: Mouse, className: "top-2 right-[32%] size-9 rotate-12 text-primary/20 [--parallax-to:-110px] max-sm:hidden" },
  { icon: Headphones, className: "-bottom-4 right-[2%] size-12 rotate-12 text-primary/15 [--parallax-to:-90px]" },
  { icon: Laptop, className: "top-1/2 right-[44%] size-10 -rotate-12 text-primary/10 [--parallax-to:-50px] max-md:hidden" },
  { icon: Webcam, className: "-top-2 right-[18%] size-8 text-primary/20 [--parallax-to:-130px] max-sm:hidden" },
];

/** トップページ最上部のリード（ページ唯一の h1） */
export function HomeIntro({ productCount }: { productCount: number }) {
  return (
    <div className="relative overflow-x-clip py-2 sm:py-6">
      {/* 装飾（読み上げ対象外・クリック不可） */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {FLOATING_ICONS.map(({ icon: Icon, className }, index) => (
          <Icon key={index} className={cn("parallax-scroll absolute", className)} strokeWidth={1.5} />
        ))}
      </div>

      <div className="relative flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          デスク周辺機器を、<span className="text-primary">スペックで最短比較。</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          パソコン・モニター・キーボード・マウスなど {productCount} 商品を編集部がレビュー。条件で絞り込んで、自分に合う1台がすぐ見つかります。
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          最終更新日：{SITE_LAST_UPDATED_LABEL}
        </p>
      </div>
    </div>
  );
}
