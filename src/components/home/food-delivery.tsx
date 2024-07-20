import Image from "next/image";
import { Link, type Locale } from "@/navigation";
import Container from "../ui/container";
import { useLocale, useTranslations } from "next-intl";

import MotionDiv from "../ui/motion-div";

const FoodDelivery = () => {
  const t = useTranslations("pages.home.deliverySection");
  const locale = useLocale() as Locale;
  return (
    <section>
      <Container className="mt-20 overflow-x-hidden">
        <div className="mb-10">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className=" mx-auto mt-4 w-full text-center text-muted-foreground md:w-[40%]">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <MotionDiv
            initial={{ opacity: 0, x: locale === "en" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-fill flex overflow-hidden rounded-md border border-gray-300">
              <div className="w-[35%] max-w-[200px] bg-[#ed613d]">
                <Image
                  className="mb-auto ml-auto pb-5"
                  src="/assets/images/food.png"
                  alt="food"
                  width={164}
                  height={164}
                />
              </div>
              <div className="relative w-[65%] px-5 pb-10 pt-5">
                <h3 className=" mb-2 text-2xl font-medium text-foreground">
                  {t("mealsCard.title")}
                </h3>

                <p className="text-muted-foreground">
                  {t("mealsCard.description")}
                </p>

                <Link
                  href="/products"
                  className=" absolute bottom-3 text-primary"
                >
                  {t("button")}
                </Link>
              </div>
            </div>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: locale === "en" ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-fill flex overflow-hidden rounded-md border border-gray-300">
              <div className="w-[35%] max-w-[200px] bg-[#00b68d]">
                <Image
                  className="mb-auto ml-auto pb-5"
                  src="/assets/images/grocery.png"
                  alt="food"
                  width={164}
                  height={164}
                />
              </div>
              <div className="relative w-[65%] px-5 pb-10 pt-5">
                <h3 className=" mb-2 text-2xl font-medium text-foreground">
                  {t("groceriesCard.title")}
                </h3>

                <p className="text-muted-foreground">
                  {t("groceriesCard.description")}
                </p>

                <Link
                  href="/products"
                  className=" absolute bottom-3 text-primary"
                >
                  {t("button")}
                </Link>
              </div>
            </div>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: locale === "en" ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-fill flex overflow-hidden rounded-md border border-gray-300">
              <div className="w-[35%] max-w-[200px] bg-[#FEFEFE]">
                <Image
                  className="mb-auto ml-auto pb-5"
                  src="/assets/images/dessert.jpg"
                  alt="food"
                  width={164}
                  height={164}
                  // placeholder="blur"
                />
              </div>
              <div className="relative w-[60%] px-5 pb-10 pt-5">
                <h3 className=" mb-2 text-2xl font-medium text-foreground">
                  {t("desertsCard.title")}
                </h3>

                <p className="text-muted-foreground">
                  {t("desertsCard.description")}
                </p>

                <Link
                  href="/products"
                  className=" absolute bottom-3 text-primary"
                >
                  {t("button")}
                </Link>
              </div>
            </div>
          </MotionDiv>
        </div>
      </Container>
    </section>
  );
};

export default FoodDelivery;
