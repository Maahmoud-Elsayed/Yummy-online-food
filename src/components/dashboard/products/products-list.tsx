import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

import { PagePagination } from "@/components/products/page-pagination";
import { filteredProductsSchema } from "@/lib/validations-schema/product-schema";
import { getTranslations } from "next-intl/server";
import ProductCard from "./product-card";
import { type Product } from "@/server/api/routers/products";

type ProductListProps = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

const ProductsList = async ({ searchParams }: ProductListProps) => {
  let page = Number(searchParams?.page) || 1;
  page = page < 1 ? 1 : page;
  const validateParams = filteredProductsSchema.safeParse({
    ...searchParams,
    page,
  });
  if (!validateParams.success) {
    notFound();
  }
  let products: Product[] = [];
  let totalPages = 0;
  let hasNextPage = false;
  try {
    const data = await api.products.getAll(validateParams.data);
    products = data.products ?? [];
    totalPages = data.totalPages ?? 0;
    hasNextPage = data.hasNextPage ?? false;
  } catch (error) {}
  if (page !== 1 && page > totalPages) {
    notFound();
  }
  const t = await getTranslations("dashboard.allProducts");
  return (
    <>
      <div className="">
        {products.length > 0 ? (
          <ul className=" grid w-full grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-2  lg:gap-6">
            {products.map((product) => (
              <li className="flex w-full justify-center" key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="!mt-20  flex w-full items-center justify-center text-center text-foreground">
            <p className="text-xl">{t("empty")}</p>
          </div>
        )}
      </div>
      {products.length > 0 && (
        <PagePagination
          searchParams={searchParams}
          page={page}
          pathName="/dashboard/products"
          totalPages={totalPages}
          hasNextPage={hasNextPage}
        />
      )}
    </>
  );
};

export default ProductsList;
