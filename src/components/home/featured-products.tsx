import { api } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
import Container from "../ui/container";
import ListItems from "./list-items";

const FeaturedProducts = async () => {
  const featuredItems = await api.products.filteredProducts({
    filter: "latest",
  });
  const t = await getTranslations("pages.home.productsSection");
  return (
    <section>
      <Container className="mt-20">
        <h2 className="mb-10 text-center text-2xl font-semibold text-foreground">
          {t("latest")}
        </h2>
        <ListItems products={featuredItems} type="featured" />
      </Container>
    </section>
  );
};

export default FeaturedProducts;
