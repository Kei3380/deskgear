import Link from "next/link";
import { Clock, Cpu } from "lucide-react";
import { SITE_LAST_UPDATED_LABEL } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-semibold">
          <Cpu className="size-5 text-primary" />
          <span>
            DESK<span className="text-primary">GEAR</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors hover:text-foreground">
            トップ
          </Link>
          <Link href="/search" className="transition-colors hover:text-foreground">
            商品検索
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/40 bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center gap-1.5 px-4 py-1 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          最終更新日：{SITE_LAST_UPDATED_LABEL}
        </div>
      </div>
    </header>
  );
}
