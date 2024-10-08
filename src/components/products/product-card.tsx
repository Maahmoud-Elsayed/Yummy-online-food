import { Link } from "@/navigation";
import Image from "next/image";

import { formatPrice } from "@/lib/utils";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import AddButton from "./add-button";

import { getImagePlaceHolder } from "@/lib/image-placeholder";
import { type Locale } from "@/navigation";
import { type Product } from "@/server/api/routers/products";
import "@smastrom/react-rating/style.css";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import Price from "../ui/price";

type ProductCardProps = {
  product: Omit<Product, "category"> & {
    category?: Product["category"];
  };
  type?: "featured" | "popular";
};
const ProductCard = async ({ product, type }: ProductCardProps) => {
  const locale = await getLocale();
  const t = await getTranslations("pages.productDetails");
  const base64 = await getImagePlaceHolder(product.image);
  return (
    <Card className="relative flex h-full  w-full   gap-2 overflow-hidden rounded-lg ">
      <div className="group relative aspect-square w-full max-w-[150px]  overflow-hidden bg-[#F7F7F7] sm:max-w-[170px] ">
        <Image
          className=" mx-auto h-auto w-auto transition-all duration-300 group-hover:scale-125  "
          src={product.image}
          alt={product[`name_${locale as Locale}`]}
          fill
          style={{ objectFit: "fill" }}
          placeholder="blur"
          blurDataURL={base64}
        />

        {type ? (
          <Badge className="absolute top-2 z-10 rounded-full  bg-primary px-2 text-[10px] text-primary-foreground  transition-all duration-300 group-hover:opacity-0 ltr:left-2 rtl:right-2">
            {type === "featured"
              ? t("new")
              : type === "popular"
                ? t("popular")
                : null}
          </Badge>
        ) : product.discount > 0 ? (
          <Badge className="absolute top-2 z-10 flex gap-1 rounded-full  bg-primary px-2 text-[10px] text-primary-foreground  transition-all duration-300 group-hover:opacity-0 ltr:left-2 rtl:right-2 rtl:flex-row-reverse">
            <span>{product?.discount}%</span>
            <span>{t("off")} </span>
          </Badge>
        ) : null}
      </div>
      <div className=" flex w-full grow  flex-col justify-between gap-1.5 p-2">
        <div className="flex w-full  flex-col items-start gap-1.5 self-center  ">
          <Link
            href={`/products/${product.id}`}
            className=" w-fit max-w-full truncate font-medium text-foreground hover:text-primary"
          >
            {product[`name_${locale as Locale}`]}
          </Link>

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
            <span className=" flex w-fit items-center rounded bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {product.avgRate}
            </span>
          </div>

          <p className=" text-[12px] font-semibold italic text-muted-foreground">
            {t("reviews")} {product?._count?.reviews || 0}
          </p>

          {product.additions.length > 0 || product.sizes.length > 0 ? (
            <div className="flex  grow items-center">
              <p className="text-xs font-medium text-muted-foreground">
                {t("priceOnSelection")}
              </p>
            </div>
          ) : (
            <div className="flex gap-4">
              <Price
                price={product.finalPrice}
                currency={locale === "ar" ? "EGP" : "USD"}
                className="rtl:flex-row-reverse"
              />
              {product.discount > 0 && (
                <del className="text-sm text-muted-foreground ">
                  {formatPrice(product.price)}
                </del>
              )}
            </div>
          )}
        </div>

        <AddButton product={product} />
      </div>
    </Card>
  );
};

export default ProductCard;
