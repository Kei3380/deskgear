/**
 * 構造化データ・メタデータで使用する絶対URLの基点。
 * Vercelにデプロイした場合は本番ドメインを自動的に使用し、
 * それ以外（ローカル開発等）では `NEXT_PUBLIC_SITE_URL` またはlocalhostにフォールバックする。
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_NAME = "DESKGEAR";

/**
 * サイトの最終更新日（ビルド実行時点のタイムスタンプ）。CMS/DBを持たない完全SSG構成のため、
 * 商品情報がいつ時点のものかをユーザーに示す指標として、ビルド時刻を日本時間の日付表示に変換して使用する。
 */
export const SITE_LAST_UPDATED_LABEL = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date());
