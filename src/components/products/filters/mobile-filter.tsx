import { FaFilter, FaSort } from "react-icons/fa";
import { Separator } from "../../ui/separator";
import CategoryFilter from "./category-filter";
import DiscountFilter from "./discount-filter";
import PriceFilter from "./price-filter";
import SortFilter from "./sort-filter";
import { useTranslations } from "next-intl";

const MobileFilter = () => {
  const t = useTranslations("pages.products");
  return (
    <div className=" space-y-4 rounded bg-gray-100 pb-4 shadow-md">
      <div className=" w-full space-y-4 ">
        <div className="flex items-center gap-1 bg-gray-200 px-4 py-2">
          <FaSort className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-foreground">{t("sort.title")}</h2>
        </div>
        <SortFilter />
      </div>

      <div className=" flex-1 space-y-4">
        <div className="flex items-center gap-1 bg-gray-200 px-4 py-2">
          <FaFilter className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-foreground">{t("filter.title")}</h2>
        </div>
        <div className="space-y-4">
          <CategoryFilter className="flex flex-wrap gap-4" />
          <Separator className="bg-gray-300" />

          <PriceFilter className="flex flex-1 gap-2" />
          <Separator className="bg-gray-300" />
          <DiscountFilter />
        </div>
      </div>
    </div>
  );
};

export default MobileFilter;
