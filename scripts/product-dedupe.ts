import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * 商品自動追加の重複防止。
 * 登録済み商品（content/products/*.md の全ステータス）と除外リスト（scripts/import-exclude.json）から
 * 照合キーを集め、楽天APIの取得商品がいずれかに一致したら「登録済み」とみなす。
 *
 * 照合キー:
 * - item:  楽天の商品ページ `item.rakuten.co.jp/{ショップ}/{商品ID}/` の「ショップ/商品ID」。
 *          アフィリエイトURL（hb.afl.rakuten.co.jp）の `pc` パラメータからも復元する
 * - image: 商品画像URLのパス（`?_ex=` 等のクエリを除く）。短縮リンク（a.r10.to）の商品用
 */

export type RakutenItemLike = {
  itemName: string;
  itemUrl?: string;
  affiliateUrl?: string;
  mediumImageUrls?: { imageUrl: string }[];
  smallImageUrls?: { imageUrl: string }[];
};

type ExcludeEntry = { key: string; note?: string };

export const EXCLUDE_LIST_PATH = path.join(process.cwd(), "scripts", "import-exclude.json");

function safeUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

/** 楽天の商品ページURL・アフィリエイトURLから「item:ショップ/商品ID」キーを取り出す */
export function toItemKey(value: string | undefined): string | null {
  if (!value) return null;
  const url = safeUrl(value);
  if (!url) return null;

  if (url.hostname === "hb.afl.rakuten.co.jp") {
    return toItemKey(url.searchParams.get("pc") ?? undefined);
  }
  if (url.hostname === "item.rakuten.co.jp") {
    const [shop, itemId] = url.pathname.split("/").filter(Boolean);
    if (shop && itemId) return `item:${shop}/${itemId}`.toLowerCase();
  }
  return null;
}

/** 画像URLから「image:パス」キーを取り出す（サイズ指定クエリの違いを無視するため） */
export function toImageKey(value: string | undefined): string | null {
  if (!value) return null;
  const url = safeUrl(value);
  if (!url) return null;
  return `image:${url.hostname}${url.pathname}`.toLowerCase();
}

/** 楽天APIの取得商品から照合キーを列挙する */
export function keysOfRakutenItem(item: RakutenItemLike): string[] {
  return [
    toItemKey(item.itemUrl),
    toItemKey(item.affiliateUrl),
    toImageKey(item.mediumImageUrls?.[0]?.imageUrl),
    toImageKey(item.smallImageUrls?.[0]?.imageUrl),
  ].filter((key): key is string => key !== null);
}

function loadExcludeKeys(): string[] {
  if (!fs.existsSync(EXCLUDE_LIST_PATH)) return [];
  try {
    const entries = JSON.parse(fs.readFileSync(EXCLUDE_LIST_PATH, "utf8")) as ExcludeEntry[];
    return entries.map((entry) => entry.key.toLowerCase());
  } catch (error) {
    // 除外リストが壊れていると重複を防げないため、黙って続行せず異常終了させる
    throw new Error(`除外リスト ${EXCLUDE_LIST_PATH} の読み込みに失敗しました: ${String(error)}`);
  }
}

/** 登録済み商品と除外リストから照合キーの集合を作る（draft/archived も対象） */
export function loadRegisteredKeys(productsDir: string): Set<string> {
  const keys = new Set<string>(loadExcludeKeys());
  if (!fs.existsSync(productsDir)) return keys;

  for (const file of fs.readdirSync(productsDir).filter((f) => f.endsWith(".md"))) {
    const { data } = matter(fs.readFileSync(path.join(productsDir, file), "utf8"));
    const candidates = [
      toItemKey(data.affiliate_links?.rakuten),
      toImageKey(data.image),
    ];
    for (const key of candidates) if (key) keys.add(key);
  }
  return keys;
}

/**
 * 登録済みでない商品だけを先頭から最大 limit 件選ぶ。
 * 選んだ商品のキーも集合に加え、同じ実行内での重複（同一商品の別出品など）も防ぐ。
 */
export function pickNewItems<T extends RakutenItemLike>(
  items: T[],
  registeredKeys: Set<string>,
  limit: number
): { picked: T[]; skipped: T[] } {
  const picked: T[] = [];
  const skipped: T[] = [];

  for (const item of items) {
    if (picked.length >= limit) break;
    const keys = keysOfRakutenItem(item);
    if (keys.some((key) => registeredKeys.has(key))) {
      skipped.push(item);
      continue;
    }
    picked.push(item);
    for (const key of keys) registeredKeys.add(key);
  }
  return { picked, skipped };
}
