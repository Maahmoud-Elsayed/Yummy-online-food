import { filteredProductsSchema } from "@/lib/validations-schema/product-schema";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import ProductCard from "../products/product-card";
import { PagePagination } from "./page-pagination";
import { getTranslations } from "next-intl/server";

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
  const { products, totalPages, hasNextPage } = await api.products.getAll(
    validateParams.data,
  );
  if (page > totalPages + 1) {
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
