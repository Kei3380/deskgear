import { AlertTriangle } from "lucide-react";

export function PitfallsCard({
  categoryLabel,
  pitfalls,
}: {
  categoryLabel: string;
  pitfalls: string[];
}) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6">
      <div className="flex items-center gap-2 font-heading text-base font-bold text-amber-700 dark:text-amber-400">
        <AlertTriangle className="size-5 shrink-0" aria-hidden />
        <h3>購入前に要確認！{categoryLabel}選びでよくある失敗・NG条件</h3>
      </div>
      <ul className="mt-4 flex flex-col gap-2.5">
        {pitfalls.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80">
            <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
