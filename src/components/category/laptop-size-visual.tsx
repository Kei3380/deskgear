import { Ruler } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";

/**
 * ノートPCの本体外寸と身近な紙製品を、共通の縮尺で重ねて比較する。
 * 寸法の単位はmm。SVGは 1mm = 1unit で描画する。
 * 本体外寸は各サイズの代表的な機種の目安（メーカー・機種で±1cm程度異なる）。
 * 重さは各サイズの一般的なモデルの目安（超軽量モデルはこれより軽く、ゲーミングモデルは重い）。
 */
type SizeItem = {
  size: string;
  badge: string;
  featured?: boolean;
  laptop: { w: number; h: number };
  paper: { name: string; w: number; h: number };
  weight: { range: string; analogy: string };
  desc: string;
};

const SIZE_ITEMS: SizeItem[] = [
  {
    size: "13.3インチ",
    badge: "持ち歩き最優先",
    laptop: { w: 304, h: 212 },
    paper: { name: "A4用紙", w: 297, h: 210 },
    weight: { range: "約0.9〜1.3kg", analogy: "1Lの牛乳パック1本くらい" },
    desc: "A4用紙とほぼ同じ大きさ。A4書類が入るカバンならすっぽり収まり、カフェの小さなテーブルでも邪魔になりません。",
  },
  {
    size: "14インチ",
    badge: "一番人気",
    featured: true,
    laptop: { w: 315, h: 220 },
    paper: { name: "A4クリアファイル", w: 310, h: 220 },
    weight: { range: "約1.0〜1.5kg", analogy: "1Lの牛乳パック1〜1.5本分" },
    desc: "A4クリアファイルとほぼ同じ大きさ。13.3型より画面が広いのに、カバンに入るかどうかはほとんど変わりません。",
  },
  {
    size: "15.6インチ",
    badge: "据え置き向き",
    laptop: { w: 360, h: 245 },
    paper: { name: "B4用紙", w: 364, h: 257 },
    weight: { range: "約1.6〜2.2kg", analogy: "2Lのペットボトル1本くらい" },
    desc: "B4用紙（学校のテスト用紙の大きさ）とほぼ同じ。A4用のカバンには入らないことが多く、自宅やオフィスでの据え置き向きです。",
  },
];

/** 全SVGの高さを揃えて縮尺を共通にするため、最大の高さを基準にする */
const PAD = 12;
const MAX_H = Math.max(...SIZE_ITEMS.flatMap((i) => [i.laptop.h, i.paper.h]));
const VIEW_H = MAX_H + PAD * 2;

function ScaleDiagram({ item }: { item: SizeItem }) {
  const slotW = Math.max(item.laptop.w, item.paper.w);
  const viewW = slotW + PAD * 2;
  const baseY = PAD + MAX_H; // 紙とPCを下端で揃える

  const paperX = PAD + (slotW - item.paper.w) / 2;
  const laptopX = PAD + (slotW - item.laptop.w) / 2;

  return (
    <svg
      viewBox={`0 0 ${viewW} ${VIEW_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${item.size}のノートPC（約${item.laptop.w / 10}×${item.laptop.h / 10}cm）と${item.paper.name}（${item.paper.w / 10}×${item.paper.h / 10}cm）の比較図`}
    >
      {/* ノートPC本体（閉じた状態を真上から見た外形） */}
      <rect
        x={laptopX}
        y={baseY - item.laptop.h}
        width={item.laptop.w}
        height={item.laptop.h}
        rx={12}
        className="fill-primary/15 stroke-primary"
        strokeWidth={3}
      />
      <circle
        cx={laptopX + item.laptop.w / 2}
        cy={baseY - item.laptop.h / 2}
        r={14}
        className="fill-primary/25"
      />

      {/* 紙（PCとほぼ同じ大きさで隠れてしまうため、点線の枠としてPCの上に重ねる） */}
      <rect
        x={paperX}
        y={baseY - item.paper.h}
        width={item.paper.w}
        height={item.paper.h}
        className="fill-none stroke-amber-600"
        strokeWidth={3}
        strokeDasharray="10 7"
      />
    </svg>
  );
}

export function LaptopSizeVisual() {
  return (
    <section aria-labelledby="size-visual-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <SectionHeading id="size-visual-heading" icon={Ruler}>
          ひと目でわかる！ノートPCの大きさ（身近な紙との比較）
        </SectionHeading>
        <p className="text-xs text-muted-foreground sm:text-sm">
          「○○インチ」は画面の対角線の長さなので、本体の大きさがイメージしにくい数字です。本体を閉じて真上から見た大きさを、身近な紙と同じ縮尺で重ねました。
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* 縮尺どおりの比較図 */}
        <div className="flex flex-col gap-3 p-4 sm:p-6">
          <div className="flex items-end">
            {SIZE_ITEMS.map((item) => {
              const viewW = Math.max(item.laptop.w, item.paper.w) + PAD * 2;
              return (
                <div
                  key={item.size}
                  className="flex min-w-0 flex-col items-center gap-1.5"
                  // 各列の幅をSVGの横幅に比例させ、3つの図の縮尺を揃える
                  style={{ flex: `${viewW} 1 0` }}
                >
                  <ScaleDiagram item={item} />
                  <span className="font-heading text-xs font-bold text-foreground sm:text-sm">
                    {item.size}
                  </span>
                  <span className="text-center text-[10px] leading-tight font-semibold text-primary sm:text-xs">
                    ≒ {item.paper.name}
                  </span>
                  <span className="text-center text-[10px] leading-tight text-muted-foreground sm:text-xs">
                    {item.weight.range}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground sm:text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-4 rounded-[3px] border-2 border-primary bg-primary/15" aria-hidden />
              ノートPC本体
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-3 w-4 border-2 border-dashed border-amber-600" aria-hidden />
              紙（点線）
            </span>
            <span>3つの図は同じ縮尺です。本体の大きさは機種により±1cm程度異なります。重さは一般的なモデルの目安で、超軽量モデルはこれより軽く、ゲーミングモデルは重くなります。</span>
          </div>
        </div>

        {/* 解説カード */}
        <div className="grid gap-3 border-t border-border/60 bg-accent/20 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6">
          {SIZE_ITEMS.map((item) => (
            <div
              key={item.size}
              className={`flex flex-col gap-2 rounded-xl border p-4 shadow-xs ${
                item.featured
                  ? "border-primary/50 bg-card ring-1 ring-primary/30"
                  : "border-border/70 bg-card"
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-heading text-sm font-bold text-foreground sm:text-base">
                  {item.size}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    item.featured
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.badge}
                </span>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[11px] sm:text-xs">
                <dt className="text-muted-foreground">本体</dt>
                <dd className="font-medium text-foreground">
                  約{item.laptop.w / 10}×{item.laptop.h / 10}cm
                </dd>
                <dt className="text-muted-foreground">{item.paper.name}</dt>
                <dd className="font-medium text-foreground">
                  {item.paper.w / 10}×{item.paper.h / 10}cm
                </dd>
                <dt className="text-muted-foreground">重さ</dt>
                <dd className="font-medium text-foreground">
                  {item.weight.range}
                  <span className="font-normal text-muted-foreground">
                    （{item.weight.analogy}）
                  </span>
                </dd>
              </dl>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
