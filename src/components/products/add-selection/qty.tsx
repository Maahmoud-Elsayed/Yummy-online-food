"use client";
import { formatPrice } from "@/lib/utils";
import { type FeaturedProducts } from "@/server/api/routers/products";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { FaMinus, FaPlus } from "react-icons/fa";

type QtyProps = {
  additions: FeaturedProducts[number]["additions"];
  sizes: FeaturedProducts[number]["sizes"];
  defaultPrice?: number;
};
const Qty = ({ additions, sizes, defaultPrice }: QtyProps) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);

  const t = useTranslations("pages.products.modals.addToCart");

  const { setValue, control } = useFormContext();
  const sizeValue = useWatch({
    control,
    name: "size",
    defaultValue: undefined,
  });
  const additionsValue = useWatch({
    control,
    name: "additions",
    defaultValue: [],
  });

  useEffect(() => {
    let itemPrice = defaultPrice ?? 0;
    setValue("quantity", qty, { shouldValidate: false });

    if (sizeValue) {
      const selectedPrice = sizes.find((item) => item.size === sizeValue);
      if (selectedPrice) {
        itemPrice += selectedPrice.finalPrice;
      }
    }

    if (additionsValue.length > 0) {
      additionsValue.forEach((addition: string) => {
        const selectedAddition = additions.find((item) => item.id === addition);
        if (selectedAddition) {
          itemPrice += selectedAddition.price;
        }
      });
    }

    setPrice(itemPrice);
    setValue("price", itemPrice, { shouldValidate: false });
  }, [sizeValue, qty, additionsValue]);

  return (
    <div className="flex w-full shrink-0 basis-1/2 items-center justify-between gap-5 self-start">
      <div className="flex items-center gap-2 rtl:flex-row-reverse ">
        <button
          type="button"
          className="h-fit rounded-md border border-gray-200 p-1"
          onClick={() => setQty((prevQty) => prevQty - 1)}
          disabled={qty <= 1}
        >
          <FaMinus className="h-4 w-4 text-primary" />
        </button>
        <span className="text-sm">{qty}</span>
        <button
          type="button"
          className="h-fit rounded-md border border-gray-200 p-1"
          onClick={() => setQty((prevQty) => prevQty + 1)}
        >
          <FaPlus className="h-4 w-4 text-primary" />
        </button>
      </div>
      {price ? (
        <p className="text-sm text-foreground">
          {t("price")}: {formatPrice(price)}
        </p>
      ) : (
        <p className="text-xs">{t("priceSelection")}</p>
      )}
    </div>
  );
};

export default Qty;
