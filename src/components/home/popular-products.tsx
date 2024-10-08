import { api } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
import Container from "../ui/container";
import ListItems from "./list-items";

const PopularProducts = async () => {
  const popularProducts = await api.products.filteredProducts({
    filter: "mostSelling",
  });
  const t = await getTranslations("pages.home.productsSection");
  return (
    <section>
      <Container className="mt-20">
        <h2 className="mb-20 text-center text-2xl font-semibold text-foreground">
          {t("popular")}
        </h2>
        <ListItems products={popularProducts} type="popular" />
      </Container>
    </section>
  );
};

export default PopularProducts;
