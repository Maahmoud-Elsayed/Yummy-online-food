import SkeletonProductList from "@/components/loading/skelton-product-list";
import ProductSearch from "@/components/products/filters/search-filter";
import ProductsFilter from "@/components/products/products-filter";
import ProductsList from "@/components/products/products-list";
import BreadcrumbResponsive from "@/components/ui/bread-crumb";

import Container from "@/components/ui/container";

import { unstable_noStore as noStore } from "next/cache";

import { Suspense } from "react";

type ProductsProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({
  params: { locale },
  searchParams,
}: {
  params: { locale: "en" | "ar" };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParams?.search
    ? (searchParams.search as string).trim().replace(/\s+/g, " ")
    : undefined;
  const data = {
    en: {
      title: search ? search : "Products",
      description: "Explore our products.",
    },
    ar: {
      title: search ? search : "المنتجات",
      description: "استكشف منتجاتنا.",
    },
  };

  return data[locale] ?? data.en;
}
const Products = async ({ searchParams }: ProductsProps) => {
  noStore();
  return (
    <Container className="relative my-6 pb-16">
      {/* <BreadCrumb /> */}
      <BreadcrumbResponsive />
      <div className="mt-6 flex gap-4 rtl:flex-row-reverse">
        <div className="hidden lg:flex">
          <ProductsFilter />
        </div>
        <div className="flex-1 space-y-4">
          <ProductSearch />
          <Suspense
            fallback={<SkeletonProductList />}
            key={Object.values(searchParams ?? {}).join("") + "products"}
          >
            <ProductsList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </Container>
  );
};

export default Products;
