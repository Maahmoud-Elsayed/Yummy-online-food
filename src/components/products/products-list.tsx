import { filteredProductsSchema } from "@/lib/validations-schema/product-schema";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import ProductCard from "../products/product-card";
import { PagePagination } from "./page-pagination";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("pages.products");
  return (
    <>
      <div className="">
        {products.length > 0 ? (
          <ul className=" grid w-full grid-cols-1 justify-items-center gap-4 md:grid-cols-2 lg:grid-cols-2 lg:gap-6">
            {products.map((product) => (
              <li className="flex w-full justify-center" key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="!mt-20  flex w-full items-center justify-center text-center text-foreground">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        )}
      </div>
      {products.length > 0 && (
        <PagePagination
          searchParams={searchParams}
          page={page}
          pathName="/products"
          totalPages={totalPages}
          hasNextPage={hasNextPage}
        />
      )}
    </>
  );
};

export default ProductsList;
