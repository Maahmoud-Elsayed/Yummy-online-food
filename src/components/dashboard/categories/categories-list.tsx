"use client";
import LoadingSpinner from "@/components/loading/loading-spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type Locale } from "@/navigation";
import { api } from "@/trpc/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { FaBookOpen } from "react-icons/fa6";
import { MdFastfood } from "react-icons/md";
import DeleteItem from "../../modals/delete-item";
import UpsertCategory from "../../modals/upsert-category";
import SummaryCard from "../summary/summary-card";

const CategoriesList = () => {
  const t = useTranslations("dashboard.categories");
  const { data, isLoading } = api.categories.getAll.useQuery();
  const { categories, count } = data ?? { categories: [], count: 0 };

  const locale = useLocale() as Locale;

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className="">
      <div className="my-10 grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <SummaryCard
          title={t("totalCategories")}
          icon={<FaBookOpen className="h-5 w-5 text-muted-foreground" />}
        >
          <div className="text-2xl font-bold">+{count}</div>
        </SummaryCard>
        <UpsertCategory />
      </div>
      {categories.length > 0 ? (
        <Accordion
          type="single"
          collapsible
          className="mt-5 w-full divide-y-2  divide-solid divide-white rounded-lg border border-gray-200 bg-gray-50 py-4"
        >
          {categories.map((category) => (
            <AccordionItem
              value={category.id}
              key={category.id}
              className=" px-4"
            >
              <div className="flex items-center gap-5">
                <div className="w-full flex-1">
                  <AccordionTrigger className=" hover:no-underline">
                    <div className="flex items-end gap-3">
                      <MdFastfood className="mb-[3px] h-5 w-5 text-muted-foreground" />
                      <span className=" font-medium  text-foreground">
                        {category[`name_${locale}`]}
                      </span>
                    </div>
                  </AccordionTrigger>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <UpsertCategory category={category} />
                  <DeleteItem id={category.id} type="categories" />
                </div>
              </div>
              <AccordionContent className="rounded-lg bg-white p-4">
                <div className="flex w-full  items-center justify-between gap-y-4 ">
                  <div className="flex-1 space-y-2">
                    <h3 className=" font-medium text-foreground">
                      {t("nameEn")} :{" "}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {category.name_en}
                      </span>
                    </h3>
                    <h3 className=" font-medium text-foreground">
                      {t("nameAr")} :{" "}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {category.name_ar}
                      </span>
                    </h3>
                    <h3 className="  font-medium text-foreground ">
                      {t("products")} :{" "}
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {category._count.products}
                      </span>
                    </h3>
                  </div>
                  <div className="relative flex h-[100px] w-[100px] items-center justify-center  lg:h-[150px] lg:w-[150px] ">
                    <Image
                      src={category.image}
                      alt={category.name_en}
                      fill
                      className="h-auto w-auto rounded-lg"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="my-20 flex h-full w-full items-center justify-center">
          <p className="text-lg text-muted-foreground ">{t("empty")}</p>
        </div>
      )}
    </div>
  );
};

export default CategoriesList;
