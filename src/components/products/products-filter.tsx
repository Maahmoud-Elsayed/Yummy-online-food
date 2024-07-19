"use client";
import { FaFilter, FaSort } from "react-icons/fa";
import { Separator } from "../ui/separator";
import CategoryFilter from "./filters/category-filter";
import DiscountFilter from "./filters/discount-filter";
import PriceFilter from "./filters/price-filter";
import SortFilter from "./filters/sort-filter";
import { useTranslations } from "next-intl";

const ProductsFilter = () => {
  const t = useTranslations("pages.products");
  return (
    <div className="shrink-0 space-y-4 rounded bg-gray-100 py-4 shadow-md">
      {/* Sort section */}
      <div className="space-y-4 ">
        <div className="flex items-center gap-1 bg-gray-200 px-4 py-2">
          <FaSort className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-foreground">{t("sort.title")}</h2>
        </div>
        <SortFilter />
      </div>

      {/* Category selection */}
      <div className="space-y-4 ">
        <div className="flex items-center gap-1 bg-gray-200 px-4 py-2">
          <FaFilter className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-foreground">{t("filter.title")}</h2>
        </div>
        <CategoryFilter className="space-y-2" />

        <Separator className="bg-gray-300" />
        <DiscountFilter className="space-y-2" />
        <Separator className="bg-gray-300" />
        {/* Price filter */}
        <PriceFilter className="space-y-2" />
      </div>
    </div>
  );
};

export default ProductsFilter;
