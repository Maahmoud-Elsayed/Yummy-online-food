"use client";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { useFilter } from "@/hooks/use-filter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import MobileFilter from "./mobile-filter";
import { useTranslations } from "next-intl";

const ProductSearch = ({ dashboard }: { dashboard?: boolean }) => {
  const [search, setSearch] = useFilter<string>("search", "", { delay: 1000 });
  const [open, setOpen] = useState(false);
  const t = useTranslations("pages.products");
  return (
    <div className="overflow-hidden rounded-lg">
      <div className=" flex w-full flex-col items-center justify-between gap-2 bg-gray-100 p-4 sm:flex-row">
        <h2 className=" me-auto text-lg text-foreground ">{t("title")}</h2>
        <div className="flex w-full gap-2 sm:w-fit">
          <div className="relative w-full sm:w-fit">
            <Input
              className="bg-white ltr:pr-8 rtl:pl-8"
              id="search"
              type="text"
              placeholder={t("placeholder")}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <IoIosSearch className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:right-3 rtl:left-3" />
          </div>
          <button
            className={cn(
              "aspect-square rounded-lg bg-white p-2",
              !dashboard && "lg:hidden",
            )}
            onClick={() => setOpen((prev) => !prev)}
          >
            <FaFilter className="text-muted-foreground" />
          </button>
        </div>
      </div>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
        className="!mt-0"
        defaultOpen={false}
      >
        <CollapsibleContent>
          <MobileFilter />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ProductSearch;
