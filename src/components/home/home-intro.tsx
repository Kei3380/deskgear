import { Clock } from "lucide-react";

import { SITE_LAST_UPDATED_LABEL } from "@/lib/site";

/** トップページ最上部のリード（ページ唯一の h1） */
export function HomeIntro({ productCount }: { productCount: number }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        デスク周辺機器を、<span className="text-primary">スペックで最短比較。</span>
      </h1>
      <p className="text-sm text-muted-foreground sm:text-base">
        パソコン・モニター・キーボード・マウスなど {productCount} 商品を編集部がレビュー。条件で絞り込んで、自分に合う1台がすぐ見つかります。
      </p>
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="size-3.5" aria-hidden />
        最終更新日：{SITE_LAST_UPDATED_LABEL}
      </p>
    </div>
  );
}
