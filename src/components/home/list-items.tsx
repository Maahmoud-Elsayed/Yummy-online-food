import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "@/navigation";
import { type Product } from "@/server/api/routers/products";
import { useLocale, useTranslations } from "next-intl";
import ProductCard from "../products/product-card";
import { Card } from "../ui/card";

type ListItemsProps = {
  products: Omit<Product, "category">[];
  type?: "featured" | "popular";
  direction?: "forward" | "backward";
};
const ListItems = ({
  products,
  type,
  direction = "forward",
}: ListItemsProps) => {
  const t = useTranslations("pages.home.productsSection");
  const locale = useLocale();
  return (
    <div className=" w-full">
      {products.length > 0 ? (
        <Carousel
          className="w-full"
          opts={{
            // slidesToScroll: 1,
            // align: "start",
            direction: locale === "ar" ? "rtl" : "ltr",
            loop: true,
            dragFree: true,
          }}
          autoScroll
          autoScrollOpts={{
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            direction: direction,
            startDelay: 500,
            speed: 1,
          }}
        >
          <CarouselContent className="">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className=" flex basis-full cursor-grab  justify-center    sm:basis-3/4 md:basis-2/3   lg:basis-1/2"
              >
                <ProductCard product={product} type={type} />
              </CarouselItem>
            ))}
            <CarouselItem className=" flex basis-full cursor-grab  justify-center sm:basis-3/4 md:basis-2/3   lg:basis-1/2">
              <Link
                className="h-full w-full"
                href={{
                  pathname: "/products",
                  query:
                    type === "featured"
                      ? { sortBy: "date-desc" }
                      : type === "popular"
                        ? { sortBy: "sold-desc" }
                        : { discount: true },
                }}
              >
                <Card className="  flex  h-full w-full   flex-col items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-100 p-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {t(`card.${type ? type : "sales"}`)}
                  </h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {t(`card.${type ? type : "sales"}Description`)}
                  </p>
                </Card>
              </Link>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-muted-foreground">{t("empty")}</p>
        </div>
      )}
    </div>
  );
};

export default ListItems;
