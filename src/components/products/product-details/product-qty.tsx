"use client";

import { useFilter } from "@/hooks/use-filter";
import { useTranslations } from "next-intl";

import { FaMinus, FaPlus } from "react-icons/fa6";

const ProductQty = () => {
  const [qty, setQty] = useFilter<number>("qty", 1, {
    delay: 0,
    route: "replace",
    remove: 1,
  });

  const t = useTranslations("pages.productDetails");

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-foreground rtl:text-right">
        {t("qty")}
      </h3>
      <div className="flex items-center gap-4 overflow-hidden rounded-lg border border-gray-200">
        <button
          type="button"
          className=" h-fit rounded-md border border-gray-200 p-1 text-primary disabled:cursor-not-allowed disabled:bg-gray-100"
          onClick={() => setQty((prevQty) => Number(prevQty) - 1)}
          disabled={qty <= 1}
        >
          <FaMinus className="h-4 w-4" />
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
    </div>
  );
};

export default ProductQty;
