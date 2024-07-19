import ProductsList from "@/components/dashboard/products/products-list";
import SkeletonProductList from "@/components/loading/skelton-product-list";

import ProductSearch from "@/components/products/filters/search-filter";
import { getTranslations } from "next-intl/server";

import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: { title: "Products", description: "Manage your products." },
    ar: { title: "المنتجات", description: "إدارة المنتجات." },
  };

  return data[locale] ?? data.en;
}

type ProductsProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};
const Products = async ({ searchParams }: ProductsProps) => {
  noStore();
  const t = await getTranslations("dashboard.allProducts");
  return (
    <div className="relative z-10 my-10 space-y-4 pb-20">
      <h1 className="mb-10 text-xl font-medium text-foreground">
        {t("title")}
      </h1>
      <ProductSearch dashboard />
      <Suspense
        fallback={<SkeletonProductList />}
        key={Object.values(searchParams ?? {}).join("") + "products"}
      >
        <ProductsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default Products;
