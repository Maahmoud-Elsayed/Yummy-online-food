"use client";
import Price from "@/components/ui/price";
import { formatPrice } from "@/lib/utils";
import { type Size } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

type ProductPriceProps = {
  sizes?: {
    size: Size;
    price: number;
    finalPrice: number;
  }[];
  additions?: { name: { en: string; ar: string }; price: number }[];
  discount?: number;
};

const ProductPrice = ({ sizes, additions, discount }: ProductPriceProps) => {
  const searchParams = useSearchParams();
  const SizeParam = searchParams.get("size");
  const additionsParam = searchParams.get("additions");
  const t = useTranslations("pages.productDetails");
  let price = 0;
  let finalPrice = 0;

  if (sizes && SizeParam) {
    const selectedPrice = sizes?.find((item) => item.size === SizeParam);
    if (selectedPrice) {
      price = selectedPrice.price;
      finalPrice = selectedPrice.finalPrice;
    }

    if (additionsParam) {
      additionsParam.split("-").forEach((addition) => {
        const selectedAddition = additions?.find(
          (item) => item.name.ar === addition || item.name.en === addition,
        );
        if (selectedAddition) {
          finalPrice += selectedAddition.price;
        }
      });
    }
  }

  return (
    <div className="flex gap-4">
      {price > 0 ? (
        <>
          <Price price={finalPrice} />
          {discount && discount > 0 ? (
            <del className="text-sm text-muted-foreground ">
              {formatPrice(price)}
            </del>
          ) : null}
        </>
      ) : (
        <p className="text-sm font-medium text-muted-foreground">
          {t("priceOnSelection")}
        </p>
      )}
    </div>
  );
};

export default ProductPrice;
