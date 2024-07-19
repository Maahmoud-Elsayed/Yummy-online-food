import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilter } from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { type Locale } from "@/navigation";
import { api } from "@/trpc/react";
import { useLocale, useTranslations } from "next-intl";

const CategoryFilter = ({ className }: { className?: string }) => {
  const { data: categories } = api.categories.getAllNames.useQuery();
  const locale = useLocale() as Locale;

  const t = useTranslations("pages.products.filter");

  const [FilteredCategories, setFilteredCategories] = useFilter<string[]>(
    "category",
    [],
  );

  return (
    <div className="space-y-2 px-4">
      <Label>{t("categories")}</Label>
      <div className={cn(className)}>
        {categories?.map((category) => (
          <div className="flex items-center gap-2" key={category.id}>
            <Checkbox
              className="bg-white"
              key={category.id}
              id={category.id}
              checked={FilteredCategories.includes(category.name_en)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFilteredCategories([
                    ...FilteredCategories,
                    category.name_en,
                  ]);
                } else {
                  setFilteredCategories(
                    FilteredCategories.filter((c) => c !== category.name_en),
                  );
                }
              }}
            />
            <Label htmlFor={category.id}>{category[`name_${locale}`]}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
