import { Price } from "@/components/common/price";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

/**
 * モバイル専用の追従CTAバー。article の末尾に置き `position: sticky` で画面下端に固定する。
 * article の終端で止まるため、フッターに重ならない（JS不要）。
 */
export function StickyCtaBar({ product }: { product: Product }) {
  const { amazon, rakuten } = product.affiliateLinks;
  if (!amazon && !rakuten) return null;

  return (
    <div className="sticky bottom-0 z-30 -mx-4 border-t border-border bg-background/95 px-4 py-2.5 backdrop-blur md:hidden">
      <div className="flex items-center gap-3">
        <Price price={product.price} className="shrink-0 text-lg" />
        <div className="flex flex-1 gap-2">
          {amazon && (
            <a
              href={amazon}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "cta" }), "h-10 flex-1 font-semibold")}
            >
              Amazon
            </a>
          )}
          {rakuten && (
            <a
              href={rakuten}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "rakuten" }), "h-10 flex-1 font-semibold")}
            >
              楽天で見る
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
