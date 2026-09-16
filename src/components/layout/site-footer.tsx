import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-muted/40">
      {/* アフィリエイト広告開示 */}
      <div className="border-b border-border/40 bg-primary/5">
        <div className="mx-auto max-w-6xl px-4 py-2 text-center text-xs text-muted-foreground">
          本サイトはアフィリエイト広告（楽天アフィリエイト・Amazonアソシエイト）を利用しています
        </div>
      </div>

      {/* フッターリンク＆コピーライト */}
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <span>© {new Date().getFullYear()} DESKGEAR</span>
        <nav className="flex items-center gap-4">
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            プライバシーポリシー
          </Link>
        </nav>
      </div>
    </footer>
  );
}
