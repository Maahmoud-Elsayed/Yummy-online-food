"use client";

import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { type Locale } from "@/navigation";
import { type FeaturedProducts } from "@/server/api/routers/products";
import { useLocale, useTranslations } from "next-intl";
import { Controller, useFormContext } from "react-hook-form";

type AdditionsSelectProps = {
  additions: FeaturedProducts[number]["additions"];
};
const AdditionsSelect = ({ additions }: AdditionsSelectProps) => {
  const { control } = useFormContext();
  const t = useTranslations("pages.products.modals.addToCart");
  const locale = useLocale() as Locale;
  return (
    <>
      <AccordionTrigger className="bg-gray-100 px-4 hover:no-underline ">
        <p className="font-normal">
          {t("additions")} :{" "}
          <span className="text-xs text-muted-foreground">
            ( {t("select")} )
          </span>
        </p>
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <Controller
          control={control}
          name="additions"
          render={({ field }) => {
            return (
              <div className=" flex flex-wrap gap-x-8 gap-y-4">
                {additions.map((addition) => {
                  return (
                    <div
                      className="flex gap-2 ltr:items-center "
                      key={addition.id}
                    >
                      <Checkbox
                        checked={field.value.includes(addition.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, addition.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== addition.id,
                                ),
                              );
                        }}
                        id={addition.id}
                        value={addition.id}
                      />
                      <Label
                        htmlFor={addition.id}
                        className="cursor-pointer text-sm font-normal text-muted-foreground"
                      >
                        {addition.name[locale]} ({addition.price.toFixed(2)})
                      </Label>
                    </div>
                  );
                })}
              </div>
            );
          }}
        />
      </AccordionContent>
    </>
  );
};
export default AdditionsSelect;
