import Link from "next/link";
import { Clock, Cpu } from "lucide-react";

import { CATEGORIES } from "@/lib/categories";
import { SITE_LAST_UPDATED_LABEL } from "@/lib/site";

const FOOTER_LINK_CLASS = "transition-colors hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/40 text-sm text-muted-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:grid-cols-[1.2fr_2fr_1fr]">
        {/* サイト概要 */}
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex items-center gap-2 font-heading text-base font-bold text-foreground">
            <Cpu className="size-4 text-primary" aria-hidden />
            <span>
              DESK<span className="text-primary">GEAR</span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed">
            デスク周辺機器をスペックで絞り込み、最短で比較できるガジェットレビューサイト。
          </p>
        </div>

        {/* カテゴリ（内部リンク） */}
        <nav aria-label="カテゴリ" className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-foreground">カテゴリ</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-3">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link href={`/search?category=${category.slug}`} className={FOOTER_LINK_CLASS}>
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* サイト情報 */}
        <nav aria-label="サイト情報" className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-foreground">サイト情報</p>
          <ul className="flex flex-col gap-1.5 text-xs">
            <li>
              <Link href="/search" className={FOOTER_LINK_CLASS}>
                商品検索
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={FOOTER_LINK_CLASS}>
                プライバシーポリシー
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* アフィリエイト広告開示・コピーライト */}
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-1.5 px-4 py-4 text-center text-xs sm:flex-row sm:justify-between sm:text-left">
          <p>本サイトはアフィリエイト広告（楽天アフィリエイト・Amazonアソシエイト）を利用しています</p>
          <p className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden />
              最終更新日：{SITE_LAST_UPDATED_LABEL}
            </span>
            <span>© {new Date().getFullYear()} DESKGEAR</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
