import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AffiliateLinks } from "@/types/product";

export function AffiliateCta({ links }: { links: AffiliateLinks }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {links.amazon && (
        <a
          href={links.amazon}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "cta", size: "lg" }),
            "flex-1 text-base font-semibold"
          )}
        >
          Amazonで最安値をチェック
        </a>
      )}
      {links.rakuten && (
        <a
          href={links.rakuten}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "rakuten", size: "lg" }),
            "flex-1 text-base font-semibold"
          )}
        >
          楽天市場でチェック
        </a>
      )}
    </div>
  );
}
