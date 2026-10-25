import { CheckCircle2, Compass } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import type { GuidePoint } from "@/lib/category-guides";

export function GuideSection({
  categoryLabel,
  points,
}: {
  categoryLabel: string;
  points: GuidePoint[];
}) {
  return (
    <section aria-labelledby="guide-heading" className="flex flex-col gap-6">
      <SectionHeading id="guide-heading" icon={Compass}>
        失敗しない{categoryLabel}の選び方 3つの重要基準
      </SectionHeading>

      <div className="grid gap-4 sm:grid-cols-3">
        {points.map((point, index) => (
          <div
            key={point.title}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xs font-bold text-primary-foreground">
                  0{index + 1}
                </span>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {point.title}
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {point.description}
              </p>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-accent/60 p-3 text-xs font-medium text-accent-foreground">
              <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" aria-hidden />
              <span>{point.criteria}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
