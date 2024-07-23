"use client";

import { useFilter } from "@/hooks/use-filter";
import { cn, formatPrice } from "@/lib/utils";
import { type Locale } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosAlert } from "react-icons/io";

type ProductSizesProps = {
  sizes?: {
    size: string;
    price: number;
    finalPrice: number;
  }[];
};
const ProductSizes = ({ sizes }: ProductSizesProps) => {
  const [filteredSizes, setFilteredSizes] = useFilter<string>("size", "", {
    delay: 0,
    route: "replace",
  });
  const t = useTranslations("pages.productDetails");
  const locale = useLocale() as Locale;

  return (
    <div className="w-full space-y-2">
      <div className=" flex items-center gap-1 rtl:flex-row-reverse">
        <h3 className=" text-lg font-medium text-foreground ">{t("size")}</h3>
        {filteredSizes ? (
          <p className="text-xs text-muted-foreground">
            ({" "}
            <span className="text-xs font-medium text-primary rtl:text-sm">
              {t(`${filteredSizes}`)}
            </span>{" "}
            )
          </p>
        ) : (
          <span className="text-xs text-muted-foreground">
            ( {t("choose")} )
          </span>
        )}
        {filteredSizes ? (
          <span className="rounded-full bg-white text-primary">
            <FaCheckCircle className=" h-3 w-3" />
          </span>
        ) : (
          <span className="rounded-full bg-white text-destructive">
            <IoIosAlert className=" h-4 w-4" />
          </span>
        )}
      </div>
      <div className="flex w-full flex-wrap justify-evenly gap-4 ">
        {sizes
          ?.sort((a, b) =>
            locale === "ar"
              ? a.size.localeCompare(b.size)
              : b.size.localeCompare(a.size),
          )
          .map((size) => (
            <button
              key={size.size}
              className={cn(
                "flex w-20 flex-col items-center justify-center gap-1 rounded-md border-t border-primary p-2 text-muted-foreground shadow-md shadow-primary hover:bg-primary hover:text-primary-foreground",
                filteredSizes === size.size &&
                  "bg-primary text-primary-foreground",
              )}
              onClick={() => setFilteredSizes(size.size)}
            >
              <span className="text-xs">{t(`${size.size}`)}</span>
              <span className="text-xs">
                {formatPrice(size.finalPrice, {
                  currency: locale === "ar" ? "EGP" : "USD",
                })}
              </span>
            </button>
          ))}
      </div>
    </div>
  );
};

export default ProductSizes;
