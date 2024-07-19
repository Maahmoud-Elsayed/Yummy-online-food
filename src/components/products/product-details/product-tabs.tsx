"use client";

import MotionDiv from "@/components/ui/motion-div";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFilter } from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { MdOutlineRateReview } from "react-icons/md";
import { PiNotepadThin } from "react-icons/pi";

const ProductTabs = () => {
  const [tabFilter, setTabFilter] = useFilter<
    "overview" | "reviews" | undefined
  >("tab", "overview", {
    delay: 0,
    route: "replace",
    remove: "overview",
  });
  const t = useTranslations("pages.productDetails");
  return (
    <TabsList className="flex h-fit bg-gray-50 px-3 py-3 shadow-md rtl:flex-row-reverse">
      <TabsTrigger value="overview" asChild className="relative ">
        <button onClick={() => setTabFilter("overview")} className="relative">
          <div
            className={cn(
              "relative z-20 flex items-center gap-2 px-2 py-1 rtl:flex-row-reverse",
              tabFilter == "overview"
                ? "text-primary-foreground"
                : "text-foreground",
            )}
          >
            <PiNotepadThin className="h-5 w-5" />
            <h2>{t("overview")}</h2>
          </div>
          {tabFilter == "overview" && (
            <MotionDiv
              layout
              layoutId="underline"
              className=" absolute inset-0 z-10 rounded bg-primary"
            />
          )}
        </button>
      </TabsTrigger>
      <TabsTrigger value="reviews" asChild className="relative">
        <button onClick={() => setTabFilter("reviews")} className="relative ">
          <div
            className={cn(
              "relative z-20 flex items-center gap-2 px-2 py-1 rtl:flex-row-reverse",
              tabFilter == "reviews"
                ? "text-primary-foreground"
                : "text-foreground",
            )}
          >
            <MdOutlineRateReview className="h-5 w-5" />
            <h2>{t("reviews")}</h2>
          </div>
          {tabFilter == "reviews" && (
            <MotionDiv
              layout
              layoutId="underline"
              className=" absolute inset-0 z-10 rounded bg-primary"
            />
          )}
        </button>
      </TabsTrigger>
    </TabsList>
  );
};

export default ProductTabs;
