import Image from "next/image";

/**
 * 背景①: デスク写真。ページ最初の大きな画像（LCP）になるため優先読み込みする。
 * レイヤーの高さは page.tsx の BackdropSection で 65svh に指定（h1の背後だけに写真を置き、
 * 元画像に近い比率で机上の機材まで見せる）。下端はセクションの地色（slate-900）へ溶かす。
 */
export function DeskPhotoBackdrop() {
  return (
    <>
      <Image
        src="/images/beginner-set/hero.jpg"
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 1152px) 1152px, 100vw"
        className="object-cover object-[center_60%]"
      />
      {/* 白文字の可読性確保と、元画像（1376px幅）の引き伸ばしによるボケを目立たなくするための暗幕 */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/25 to-slate-900" />
      <div className="absolute inset-0 bg-primary/15 mix-blend-multiply" />
    </>
  );
}

/**
 * 背景②: インディゴのグラデーション＋ドットグリッド（画像なし・CSSのみで転送量ゼロ）。
 * ぼかし（filter/backdrop-filter）はスクロール中の負荷になるため使わず、光のにじみは放射グラデーションで表現する。
 */
export function DotPatternBackdrop() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-primary to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgb(255_255_255/0.18),transparent_45%),radial-gradient(circle_at_85%_75%,rgb(56_189_248/0.22),transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgb(255_255_255/0.16)_1px,transparent_1.5px)] bg-size-[22px_22px]" />
    </div>
  );
}
