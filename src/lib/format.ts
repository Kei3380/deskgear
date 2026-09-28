const priceFormatter = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

/** 価格を「￥149,800」形式の文字列に変換する */
export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

/** 商品名から括弧書きの補足（型番・色など）を取り除き、カード表示用に短縮する */
export function shortenTitle(title: string): string {
  return title.replace(/[（(][^）)]*[）)]/g, "").trim();
}
