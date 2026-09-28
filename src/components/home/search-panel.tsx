"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/categories";
import { SORT_LABELS, SORT_OPTION_ITEMS } from "@/lib/sort-options";

const CATEGORY_LABELS: Record<string, string> = {
  all: "すべて",
  ...Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label])),
};
const SORT_LABEL_MAP: Record<string, string> = SORT_LABELS;

export type SearchPanelValues = {
  category?: string;
  manufacturer?: string;
  sort?: string;
};

export function SearchPanel({
  initialValues,
  manufacturers = [],
  manufacturersByCategory = {},
}: {
  initialValues?: SearchPanelValues;
  manufacturers?: string[];
  manufacturersByCategory?: Record<string, string[]>;
}) {
  const router = useRouter();
  const [category, setCategory] = useState(initialValues?.category ?? "all");
  const [manufacturer, setManufacturer] = useState(initialValues?.manufacturer ?? "all");
  const [sort, setSort] = useState(initialValues?.sort ?? "price_desc");

  const availableManufacturers = useMemo(
    () => (category === "all" ? manufacturers : manufacturersByCategory[category] ?? []),
    [category, manufacturers, manufacturersByCategory]
  );

  const manufacturerLabels: Record<string, string> = {
    all: "すべて",
    ...Object.fromEntries(availableManufacturers.map((m) => [m, m])),
  };

  // カテゴリ変更でメーカー選択肢が絞られ、現在の選択がリストから外れる場合は「すべて」に戻す。
  function handleCategoryChange(value: string | null) {
    const nextCategory = value ?? "all";
    setCategory(nextCategory);
    const nextManufacturers =
      nextCategory === "all" ? manufacturers : manufacturersByCategory[nextCategory] ?? [];
    if (manufacturer !== "all" && !nextManufacturers.includes(manufacturer)) {
      setManufacturer("all");
    }
  }

  function handleSearch() {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (manufacturer !== "all") params.set("manufacturer", manufacturer);
    params.set("sort", sort);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Card>
      <CardContent>
        <SectionHeading icon={SlidersHorizontal} className="mb-4 text-lg">
          絞り込み検索
        </SectionHeading>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-category">カテゴリ</Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="search-category" className="w-full">
                <SelectValue placeholder="すべて">
                  {(value: string | null) => CATEGORY_LABELS[value ?? "all"]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-manufacturer">メーカー</Label>
            <Select
              value={manufacturer}
              onValueChange={(value) => setManufacturer(value ?? "all")}
            >
              <SelectTrigger id="search-manufacturer" className="w-full">
                <SelectValue placeholder="すべて">
                  {(value: string | null) => manufacturerLabels[value ?? "all"]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                {availableManufacturers.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search-sort">並び替え</Label>
            <Select value={sort} onValueChange={(value) => setSort(value ?? "price_desc")}>
              <SelectTrigger id="search-sort" className="w-full">
                <SelectValue>
                  {(value: string | null) => SORT_LABEL_MAP[value ?? "price_desc"]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTION_ITEMS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} className="w-full">
            この条件で検索
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
