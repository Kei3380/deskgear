import Link from "next/link";
import {
  Keyboard,
  Mouse,
  Monitor,
  Headphones,
  Webcam,
  Usb,
  Laptop,
  Computer,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { CATEGORIES } from "@/lib/categories";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  keyboard: Keyboard,
  mouse: Mouse,
  monitor: Monitor,
  headset: Headphones,
  webcam: Webcam,
  accessory: Usb,
  laptop: Laptop,
  desktop: Computer,
  security: ShieldCheck,
};

export function CategoryGrid({ counts }: { counts: Record<string, number> }) {
  return (
    <section aria-labelledby="category-heading">
      <SectionHeading id="category-heading" className="mb-4">
        カテゴリから探す
      </SectionHeading>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug] ?? Keyboard;
          return (
            <Link
              key={category.slug}
              href={`/search?category=${category.slug}`}
              className="group flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:p-4"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-xs font-medium leading-snug sm:text-sm">{category.label}</span>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {counts[category.slug] ?? 0}件
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
