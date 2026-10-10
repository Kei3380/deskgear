import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// 全端末で表示を揃えるため Noto Sans JP を自サイト配信する（可変ウェイト）。
// 日本語グリフは preload 対象外のため subsets は latin のみ指定。
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DESKGEAR｜パソコン選びから始まる、あなたのデスク物語",
  description:
    "パソコン選びに迷っている方へ。在宅ワーク・学習・クリエイティブなど、あなたの使い方や暮らしに合わせて、ノートパソコンと一緒に揃えたい周辺機器を組み合わせて提案します。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} h-full scroll-pt-16 antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8">
          {children}
        </main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
