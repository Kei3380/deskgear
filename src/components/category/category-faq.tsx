import { ChevronDown, HelpCircle } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import type { FaqItem } from "@/lib/category-guides";

export function CategoryFaq({
  categoryLabel,
  faqs,
}: {
  categoryLabel: string;
  faqs: FaqItem[];
}) {
  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-4">
      <SectionHeading id="faq-heading" icon={HelpCircle}>
        {categoryLabel}選びのよくある質問（Q&A）
      </SectionHeading>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, idx) => (
          <details
            key={idx}
            className="group rounded-2xl border border-border bg-card p-4 transition-colors open:bg-card/90 open:shadow-xs [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 font-heading text-sm sm:text-base font-semibold text-foreground select-none">
              <span className="flex items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  Q
                </span>
                <span>{faq.question}</span>
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="mt-3 pl-8.5 pr-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
