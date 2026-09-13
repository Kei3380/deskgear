import { Check, X } from "lucide-react";

import type { Product } from "@/types/product";

export function ProsConsTable({ product }: { product: Product }) {
  const rowCount = Math.max(product.pros.length, product.cons.length);

  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="w-1/2 px-4 py-2 text-left font-medium text-emerald-400">
              メリット
            </th>
            <th className="w-1/2 px-4 py-2 text-left font-medium text-rose-400">
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
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    {product.pros[index]}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 align-top">
                {product.cons[index] && (
                  <span className="flex items-start gap-2">
                    <X className="mt-0.5 size-4 shrink-0 text-rose-400" />
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
