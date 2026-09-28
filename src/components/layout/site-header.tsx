import Link from "next/link";
import { Cpu, PackageOpen, Search } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight">
          <Cpu className="size-5 text-primary" aria-hidden />
          <span>
            DESK<span className="text-primary">GEAR</span>
          </span>
        </Link>
        <nav aria-label="グローバルナビゲーション" className="flex items-center gap-1 text-sm sm:gap-2">
          <Link
            href="/#beginner-set"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <PackageOpen className="size-4" aria-hidden />
            <span>
              <span className="hidden sm:inline">初心者</span>セット
            </span>
          </Link>
          <Link
            href="/search"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
          >
            <Search className="size-4" aria-hidden />
            商品検索
          </Link>
        </nav>
      </div>
    </header>
  );
}
