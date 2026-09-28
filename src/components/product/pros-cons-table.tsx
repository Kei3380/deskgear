import { Check, X } from "lucide-react";

import type { Product } from "@/types/product";

export function ProsConsTable({ product }: { product: Product }) {
  const rowCount = Math.max(product.pros.length, product.cons.length);

  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 font-semibold">
            <th className="w-1/2 px-4 py-2 text-left text-success">
              メリット
            </th>
            <th className="w-1/2 px-4 py-2 text-left text-destructive">
              デメリット
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, index) => (
            <tr key={index} className="border-t border-border">
              <td className="px-4 py-3 align-top">
                {product.pros[index] && (
                  <span className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {product.pros[index]}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                {product.cons[index] && (
                  <span className="flex items-start gap-2">
                    <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                    {product.cons[index]}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
