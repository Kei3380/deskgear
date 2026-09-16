import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DESKGEAR | ガジェット特化型アフィリエイトサイト",
  description:
    "キーボード・マウス・モニターなどデスク周辺機器を、詳細スペックの絞り込み検索で最短比較。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 py-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
