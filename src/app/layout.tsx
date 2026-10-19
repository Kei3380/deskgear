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
  title: {
    default: "DESKGEAR｜快適なデスクワークを叶えるパソコン＆ガジェット選び",
    template: "%s | DESKGEAR",
  },
  description:
    "パソコン選びから始まる、理想のワークスペースづくり。暮らしや作業スタイルに寄り添うノートPCと、心地よい周辺機器（モニター・マウス・充電器など）のトータルコーディネートをご提案します。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "DESKGEAR",
    title: "DESKGEAR｜快適なデスクワークを叶えるパソコン＆ガジェット選び",
    description:
      "パソコン選びから始まる、理想のワークスペースづくり。暮らしや作業スタイルに寄り添うノートPCと、心地よい周辺機器（モニター・マウス・充電器など）のトータルコーディネートをご提案します。",
  },
  twitter: {
    card: "summary_large_image",
    title: "DESKGEAR｜快適なデスクワークを叶えるパソコン＆ガジェット選び",
    description:
      "パソコン選びから始まる、理想のワークスペースづくり。暮らしや作業スタイルに寄り添うノートPCと、心地よい周辺機器（モニター・マウス・充電器など）のトータルコーディネートをご提案します。",
  },
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
