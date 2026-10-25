import { Layers } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import type { UseCaseRecommendation } from "@/lib/category-guides";

export function UseCaseTable({
  categoryLabel,
  useCases,
}: {
  categoryLabel: string;
  useCases: UseCaseRecommendation[];
}) {
  return (
    <section aria-labelledby="usecase-heading" className="flex flex-col gap-4">
      <SectionHeading id="usecase-heading" icon={Layers}>
        【用途・目的別】あなたに最適な{categoryLabel}のスペック目安
      </SectionHeading>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 sm:p-4 font-semibold w-1/3">目的・利用シーン</th>
              <th className="p-3 sm:p-4 font-semibold w-1/3">おすすめの構成・モデル</th>
              <th className="p-3 sm:p-4 font-semibold w-1/3">重視すべき注目スペック</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {useCases.map((item, idx) => (
              <tr key={idx} className="transition-colors hover:bg-muted/20">
                <td className="p-3 sm:p-4 font-medium text-foreground align-top">
                  {item.target}
                </td>
                <td className="p-3 sm:p-4 text-primary font-semibold align-top">
                  {item.recommendation}
                </td>
                <td className="p-3 sm:p-4 text-muted-foreground align-top">
                  {item.keySpec}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
