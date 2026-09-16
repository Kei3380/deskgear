import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー | DESKGEAR",
  description:
    "DEASKGEARのプライバシーポリシーです。当サイトにおける個人情報の取り扱いおよびアフィリエイト広告の利用について説明しています。",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 py-4">
      <h1 className="text-2xl font-semibold">プライバシーポリシー</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">アフィリエイト広告について</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          当サイト（DESKGEAR）は、楽天アフィリエイトおよびAmazonアソシエイトに参加しています。
          掲載している商品リンクを経由してご購入いただいた場合、当サイトに紹介料が支払われることがあります。
          なお、リンク先の価格や在庫状況は当サイトでは管理しておらず、購入手続き・決済・発送はすべて各ECサイト（楽天市場・Amazon）が行います。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Cookieについて</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          当サイトが掲載するアフィリエイトリンクは、楽天・Amazonの成果計測システムがCookieを使用することがあります。
          これらのCookieはアフィリエイト成果の識別のみに使用され、当サイトが個人情報を収集・保管することはありません。
          Cookieの使用はお使いのブラウザ設定から無効にすることができます。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">個人情報の収集について</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          当サイトには問い合わせフォームや会員登録機能はなく、訪問者の個人情報を収集・保管する機能はありません。
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">免責事項</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          当サイトに掲載している商品情報（価格・スペック・評価など）は、掲載時点の情報をもとに作成しています。
          実際の価格や仕様は各販売ページでご確認ください。
          当サイトの情報を利用して生じたいかなる損害についても、当サイトは責任を負いかねます。
        </p>
      </section>

      <p className="text-xs text-muted-foreground">
        最終更新：2024年9月
      </p>
    </div>
  );
}
