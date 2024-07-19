import { api } from "@/trpc/server";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import Price from "@/components/ui/price";
import { formatPrice } from "@/lib/utils";
import "@smastrom/react-rating/style.css";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProductAddButton from "./product-add-button";
import ProductAdditions from "./product-additions";
import ProductPrice from "./product-price";
import ProductQty from "./product-qty";
import ProductRate from "./product-rate";
import ProductSizes from "./product-sizes";
import { type Locale } from "@/navigation";

type ProductOverviewProps = {
  productId: string;
};
const ProductOverview = async ({ productId }: ProductOverviewProps) => {
  const product = await api.products.getProductInfo(productId);

  if (!product) {
    notFound();
  }

  const t = await getTranslations("pages.productDetails");
  const locale = await getLocale();

  return (
    <Card className=" mt-10 flex w-full flex-col gap-5 p-5 md:flex-row md:gap-10 md:rtl:flex-row-reverse">
      <div className=" flex w-full flex-1 items-center justify-center rounded-lg bg-[#F7F7F7]">
        <div className="relative h-[250px] w-[250px] overflow-hidden rounded-lg">
          <Image
            src={product.image}
            alt={product[`name_${locale as Locale}`]}
            fill
          />
        </div>
      </div>
      <div className="h-px w-full rounded-md bg-gray-200 md:h-auto md:w-px"></div>
      <div className="flex-1 ">
        <div className="  space-y-4">
          <div className="  flex flex-col items-start justify-start gap-3 rtl:items-end ">
            <h2 className=" text-xl font-medium text-foreground">
              {product[`name_${locale as Locale}`]}
            </h2>

            <div className="flex w-full items-center gap-2 rtl:flex-row-reverse">
              <ProductRate
                avgRating={product.avgRate ?? 0}
                productId={productId}
              />
              <div className="flex items-center gap-2 rtl:flex-row-reverse">
                <span className="mt-1 w-fit rounded bg-slate-200 px-2.5  py-0.5 text-xs font-semibold text-primary">
                  {product.avgRate || 0}
                </span>
                <span className="mt-1 text-[12px] font-semibold italic text-muted-foreground">
                  {product?._count?.reviews || 0} {t("reviews")}
                </span>
              </div>
            </div>

            <div className=" flex w-full items-center gap-4 text-lg font-bold rtl:flex-row-reverse">
              {product?.sizes && product.sizes.length > 0 ? (
                <ProductPrice
                  sizes={product.sizes}
                  additions={product.additions}
                  discount={product.discount}
                />
              ) : (
                <div className="flex gap-4">
                  <Price price={product.finalPrice} />
                  {product?.discount && product.discount > 0 ? (
                    <del className="text-sm text-muted-foreground">
                      {formatPrice(product.price)}
                    </del>
                  ) : null}
                </div>
              )}
              {product.discount && product.discount > 0 ? (
                <p className="flex gap-1 rounded-full bg-primary px-2 text-[12px] font-[400] text-white rtl:flex-row-reverse">
                  <span>{t("save")} </span>
                  <span>{product?.discount}%</span>
                </p>
              ) : null}
            </div>

            <ProductQty />
            {product.sizes && product.sizes.length > 0 && (
              <ProductSizes sizes={product.sizes} />
            )}
            {product.additions && product.additions.length > 0 && (
              <ProductAdditions additions={product.additions} />
            )}
            <div className="space-y-2">
              <h3 className=" text-lg font-medium text-foreground rtl:text-right">
                {t("description")}
              </h3>
              <p className="text-sm leading-normal text-muted-foreground">
                {product[`description_${locale as Locale}`]}
              </p>
            </div>
            <ProductAddButton product={product} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductOverview;
