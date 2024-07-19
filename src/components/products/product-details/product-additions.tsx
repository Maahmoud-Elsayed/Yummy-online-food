"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilter } from "@/hooks/use-filter";
import { type ExtraAddition } from "@/lib/types";
import { type Locale } from "@/navigation";

import { useLocale, useTranslations } from "next-intl";
type ProductAdditionsProps = {
  additions: ExtraAddition[];
};

const ProductAdditions = ({ additions }: ProductAdditionsProps) => {
  const [filteredAdditions, setFilteredAdditions] = useFilter<string[]>(
    "additions",
    [],
    {
      delay: 0,
      route: "replace",
    },
  );
  const t = useTranslations("pages.productDetails");
  const locale = useLocale();

  return (
    <div className="w-full space-y-2">
      <h3 className=" text-lg font-medium text-foreground rtl:text-right">
        {t("additions")}
      </h3>
      <div className=" flex flex-wrap justify-start gap-4 rtl:flex-row-reverse">
        {additions?.map((addition) => {
          return (
            <div
              className="flex items-center gap-2 rtl:flex-row-reverse"
              key={addition.name[locale as Locale]}
            >
              <Checkbox
                checked={filteredAdditions.includes(addition.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilteredAdditions([...filteredAdditions, addition.id]);
                  } else {
                    setFilteredAdditions(
                      filteredAdditions.filter((a) => a !== addition.id),
                    );
                  }
                }}
                id={addition.id}
                value={addition.id}
              />
              <Label
                htmlFor={addition.name[locale as Locale]}
                className="cursor-pointer text-sm font-normal text-muted-foreground"
              >
                {addition.name[locale as Locale]} ({addition.price.toFixed(2)})
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductAdditions;
