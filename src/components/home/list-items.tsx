import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type Product } from "@/server/api/routers/products";
import { Link } from "@/navigation";
import ProductCard from "../products/product-card";
import { Card } from "../ui/card";
import { useLocale, useTranslations } from "next-intl";

type ListItemsProps = {
  products: Omit<Product, "category">[];
  type?: "featured" | "popular";
};
const ListItems = ({ products, type }: ListItemsProps) => {
  const t = useTranslations("pages.home.productsSection");
  const locale = useLocale();
  return (
    <div className=" w-full px-12 lg:px-0">
      {products.length > 0 ? (
        <Carousel
          className="w-full"
          opts={{
            slidesToScroll: 1,
            align: "start",
            direction: locale === "ar" ? "rtl" : "ltr",
            loop: true,
          }}
          autoPlay
          autoPlayOpts={{
            delay: 3000,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
          }}
        >
          <CarouselContent className="">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className=" flex basis-full cursor-grab  justify-center    lg:basis-1/2"
              >
                <ProductCard product={product} type={type} />
              </CarouselItem>
            ))}
            <CarouselItem className=" flex basis-full cursor-grab  justify-center   lg:basis-1/2">
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
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`card.${type ? type : "sales"}Description`)}
                  </p>
                </Card>
              </Link>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
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
