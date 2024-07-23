"use client";

import { AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";

import { type FeaturedProducts } from "@/server/api/routers/products";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { type Locale } from "@/navigation";

type SizeSelectProps = {
  sizes: FeaturedProducts[number]["sizes"];
};
const SizeSelect = ({ sizes }: SizeSelectProps) => {
  const t = useTranslations("pages.products.modals.addToCart");
  const locale = useLocale() as Locale;
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const size = useWatch({ control, name: "size", defaultValue: undefined });
  return (
    <>
      <AccordionTrigger className="bg-gray-100 px-4 hover:no-underline ">
        <div className=" flex items-center space-x-1 rtl:flex-row-reverse">
          {size ? (
            <span className="rounded-full bg-white text-primary">
              <FaCheckCircle className=" h-4 w-4" />
            </span>
          ) : errors?.size ? (
            <span className="rounded-full bg-white text-red-500">
              <IoIosAlert className=" h-5 w-5" />
            </span>
          ) : null}
          <p className="font-medium">
            {t("size")} :{" "}
            {size ? (
              <span className="text-xs font-medium text-primary">
                ( {t(size)} )
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">
                ( {t("choose")} )
              </span>
            )}
          </p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <Controller
          control={control}
          name="size"
          render={({ field }) => {
            return (
              <RadioGroup
                onValueChange={field.onChange}
                className="flex flex-wrap justify-between rtl:flex-row-reverse"
                value={field.value}
              >
                {sizes
                  .sort((a, b) => b.size.localeCompare(a.size))
                  .map((size) => {
                    return (
                      <div
                        className="flex gap-2 ltr:items-center rtl:flex-row-reverse rtl:items-start"
                        key={size.size}
                      >
                        <RadioGroupItem value={size.size} id={size.size} />
                        <Label
                          htmlFor={size.size}
                          className="flex cursor-pointer items-center gap-1 text-sm font-normal text-muted-foreground rtl:flex-row-reverse"
                        >
                          <span>{t(`${size.size}`)}</span>
                          <span className="text-xs">
                            (
                            {formatPrice(size.price, {
                              currency: locale === "ar" ? "EGP" : "USD",
                            })}
                            )
                          </span>
                        </Label>
                      </div>
                    );
                  })}
              </RadioGroup>
            );
          }}
        />
      </AccordionContent>
    </>
  );
};
export default SizeSelect;
