import Image from "next/image";
import { Link } from "@/navigation";

import { formatPrice } from "@/lib/utils";

import { Rating, ThinRoundedStar } from "@smastrom/react-rating";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExclamationIcon } from "@/components/ui/icons/icons";
import Price from "@/components/ui/price";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getImagePlaceHolder } from "@/lib/image-placeholder";
import { type Locale } from "@/navigation";
import { type Product } from "@/server/api/routers/products";
import "@smastrom/react-rating/style.css";
import { getLocale, getTranslations } from "next-intl/server";
import DeleteItem from "@/components/modals/delete-item";

type ProductCardProps = {
  product: Product;
};

const ProductCard = async ({ product }: ProductCardProps) => {
  const base64 = await getImagePlaceHolder(product.image);
  const t = await getTranslations("dashboard.allProducts");
  const locale = (await getLocale()) as Locale;
  return (
    <Card className="relative flex h-full  w-full    gap-2 overflow-hidden rounded-lg ">
      <div className=" relative flex h-full w-full max-w-[150px] items-center justify-center bg-[#F7F7F7] md:max-w-[200px]">
        <div className="group relative my-auto aspect-square h-auto max-h-[150px] w-full max-w-[150px] overflow-hidden bg-[#F7F7F7] md:max-h-[200px]  md:max-w-[200px]  ">
          <Image
            className=" mx-auto h-auto w-auto transition-all duration-300 group-hover:scale-125 "
            src={product.image}
            alt={product.name_en}
            fill
            style={{ objectFit: "fill" }}
            placeholder="blur"
            blurDataURL={base64}
          />
        </div>
        {product.discount > 0 && (
          <Badge className="absolute right-2 top-2 z-10 flex  gap-1 rounded-full bg-primary px-2  text-[10px] text-primary-foreground transition-all duration-300 group-hover:opacity-0 rtl:flex-row-reverse">
            {product.discount}% <span>{t("off")}</span>
          </Badge>
        )}
      </div>
      <div className=" flex w-full grow  flex-col items-start  gap-2 p-2 sm:gap-3 ">
        <div className="flex w-full  grow  flex-col items-start gap-2  ">
          <h3 className=" w-full truncate text-start text-foreground">
            {product[`name_${locale}`]}
          </h3>
          <div className="w-full truncate text-start text-xs text-foreground">
            {t("category")} :{" "}
            <span className="text-xs text-muted-foreground">
              {product.category[`name_${locale}`]}
            </span>
          </div>
          <div className="flex w-full flex-col items-start  gap-2  ">
            <div className="flex gap-2">
              <Rating
                className="-ml-0.5"
                style={{ maxWidth: 100 }}
                itemStyles={{
                  itemShapes: ThinRoundedStar,
                  activeFillColor: "#f59e0b",

                  inactiveStrokeColor: "#f59e0b",
                  activeStrokeColor: "#f59e0b",
                  itemStrokeWidth: 1,
                }}
                readOnly
                value={product.avgRate}
                halfFillMode="svg"
              />
              <span className=" flex w-fit items-start rounded bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {product.avgRate}
              </span>
            </div>

            <p className=" flex gap-1 text-xs font-semibold italic text-muted-foreground rtl:flex-row-reverse">
              {product._count.reviews || 0} <span>{t("reviews")}</span>
            </p>
          </div>
          <div className="flex gap-1 text-xs text-muted-foreground rtl:flex-row-reverse">
            {product.sold} <span>{t("sold")}</span>
          </div>
          {(product.additions.length > 0 || product.sizes.length > 0) && (
            <div className="flex  grow flex-wrap  items-center gap-2">
              {product.additions.length > 0 && (
                <div className="flex items-start gap-1">
                  <p className="flex gap-1 text-xs text-muted-foreground rtl:flex-row-reverse">
                    {product.additions.length} <span>{t("additions")}</span>
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="items-center">
                        {/* <button> */}
                        <ExclamationIcon className="h-3.5 w-3.5" />
                        {/* </button> */}
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {product.additions.map((addition) => (
                            <div key={addition.name.en} className="">
                              <span className="text-xs ">
                                {addition.name[locale]} : ${addition.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              {product.additions.length > 0 && product.sizes.length > 0 && (
                <Separator orientation="vertical" className="h-6" />
              )}
              {product.sizes.length > 0 && (
                <div className="flex items-start gap-1">
                  <p className="flex gap-1 text-xs text-muted-foreground rtl:flex-row-reverse">
                    {product.sizes.length} <span>{t("sizes")}</span>
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="items-center">
                        <ExclamationIcon className="h-3.5 w-3.5" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-black text-white">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {product.sizes.map((size) => (
                            <div key={size.size} className="">
                              <span className="text-xs capitalize ">
                                {t(size.size)} : ${size.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          )}
          {product.finalPrice > 0 && (
            <div className="flex gap-4">
              <Price
                className="rtl:flex-row-reverse"
                price={product.finalPrice}
                currency={locale === "ar" ? "EGP" : "USD"}
              />
              {product.discount > 0 && (
                <del className="text-sm text-muted-foreground ">
                  {formatPrice(product.price)}
                </del>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-start gap-x-4 gap-y-2">
          <Link
            href={{
              pathname: "/dashboard/products/add-product",
              query: { p: product.id },
            }}
            className={buttonVariants({ variant: "default", size: "sm" })}
          >
            {t("edit")}
          </Link>
          <DeleteItem id={product.id} type="products" />
          <Link
            href={`/products/${product.id}`}
            className={buttonVariants({
              variant: "link",
              size: "sm",
              className: "px-0",
            })}
          >
            {t("view")}
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
