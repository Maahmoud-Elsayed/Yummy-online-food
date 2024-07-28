import { api } from "@/trpc/server";
import { getTranslations } from "next-intl/server";
import Container from "../ui/container";
import ListItems from "./list-items";

const DiscountProducts = async () => {
  const itemsWithDiscount = await api.products.filteredProducts({
    filter: "withDiscount",
  });
  const t = await getTranslations("pages.home.productsSection");
  return (
    <section>
      <Container className="mt-20">
        <h2 className=" mb-20 text-center text-2xl font-semibold text-foreground">
          {t("discount")}
        </h2>
        <ListItems products={itemsWithDiscount} direction="backward" />
      </Container>
    </section>
  );
};

export default DiscountProducts;
