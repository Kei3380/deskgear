const RAKUTEN_THUMBNAIL_HOST = "thumbnail.image.rakuten.co.jp";
const HIGH_RES_SIZE = "500x500";

/**
 * 楽天の商品画像URLは `?_ex=240x240` 等の縮小サイズ指定付きで保存されているため、
 * 表示時に高解像度版（500x500）へ置き換える。Markdown側のデータは変更しない。
 * 楽天以外のURLや不正なURLはそのまま返す。
 */
export function toHighResImage(src: string): string {
  try {
    const url = new URL(src);
    if (url.hostname !== RAKUTEN_THUMBNAIL_HOST || !url.searchParams.has("_ex")) return src;
    url.searchParams.set("_ex", HIGH_RES_SIZE);
    return url.toString();
  } catch (error) {
    console.error(`[images] 画像URLの解析に失敗しました: ${src}`, error);
    return src;
  }
}
