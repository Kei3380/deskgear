import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 背景を画面に固定し、前面のコンテンツだけがスクロールする「窓」セクション（トップページ用）。
 *
 * - 背景は `position: sticky` のレイヤー（高さ backdropHeight）。セクション終端で背景も一緒に流れ去る
 * - 背景が固定される距離は「セクションの高さ − backdropHeight」。背景を低くするほど長く固定される
 * - 前面は負のマージンで背景レイヤーに重ねる。JS不要・スクロール中の再描画なし
 * - `background-attachment: fixed` は iOS Safari で無効かつ重いため使わない
 * - 全幅にすると Windows のスクロールバー幅ぶん横にはみ出すため、コンテナ幅の角丸の窓にする
 * - 角丸の切り抜きは `overflow-clip`（`overflow-hidden` だと sticky が効かなくなる）
 */
export function BackdropSection({
  backdrop,
  backdropHeight = "100svh",
  className,
  contentClassName,
  children,
}: {
  /** 背景レイヤーの中身（画像・グラデーションなど）。装飾扱いで読み上げ対象外 */
  backdrop: ReactNode;
  /** 固定する背景レイヤーの高さ（CSSの長さ） */
  backdropHeight?: string;
  /** 窓（外枠）のクラス。背景レイヤーより下の領域の地色などを指定する */
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("relative isolate overflow-clip rounded-3xl", className)}
      style={{ "--backdrop-h": backdropHeight } as CSSProperties}
    >
      <div aria-hidden className="pointer-events-none sticky top-0 -z-10 h-(--backdrop-h) w-full">
        {backdrop}
      </div>
      <div className={cn("relative -mt-(--backdrop-h)", contentClassName)}>{children}</div>
    </div>
  );
}
