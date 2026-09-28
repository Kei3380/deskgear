import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** ページ内セクション見出しの共通スタイル */
export function SectionHeading({
  id,
  as: Tag = "h2",
  icon: Icon,
  className,
  children,
}: {
  id?: string;
  as?: "h1" | "h2";
  icon?: LucideIcon;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      className={cn("flex items-center gap-2 font-heading text-xl font-semibold", className)}
    >
      {Icon && <Icon className="size-5 shrink-0 text-primary" aria-hidden />}
      {children}
    </Tag>
  );
}
