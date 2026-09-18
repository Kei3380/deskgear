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

import { Card } from "@/components/ui/card";
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

export function CategoryGrid() {
  return (
    <section aria-labelledby="category-heading">
      <h2 id="category-heading" className="mb-4 font-heading text-xl font-semibold">
        カテゴリ
      </h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
        {CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug] ?? Keyboard;
          return (
            <Link
              key={category.slug}
              href={`/search?category=${category.slug}`}
              className="block h-full"
            >
              <Card className="h-full items-center gap-2 p-4 text-center transition-all duration-200 hover:border-primary/60 hover:bg-accent hover:shadow-md">
                <Icon className="size-6 text-primary" />
                <span className="text-sm font-medium">{category.label}</span>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
