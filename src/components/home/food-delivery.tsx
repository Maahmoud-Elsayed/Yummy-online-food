import { Link, type Locale } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Container from "../ui/container";

import { Card } from "../ui/card";
import MotionDiv from "../ui/motion-div";

const FoodDelivery = () => {
  const t = useTranslations("pages.home.deliverySection");
  const locale = useLocale() as Locale;
  return (
    <section>
      <Container className="mt-20 ">
        <div className="mb-10">
          <h2 className="text-center text-2xl font-semibold text-foreground">
            {t("title")}
          </h2>
          <p className=" mx-auto mt-4 w-full text-center text-muted-foreground md:w-[40%]">
            {t("description")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <MotionDiv
            initial={{ opacity: 0, x: locale === "en" ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Card className="w-fill flex overflow-hidden ">
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
            </Card>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: locale === "en" ? 100 : -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Card className="w-fill flex overflow-hidden ">
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
            </Card>
          </MotionDiv>
          <MotionDiv
            initial={{ opacity: 0, x: locale === "en" ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Card className="w-fill flex overflow-hidden ">
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
            </Card>
          </MotionDiv>
        </div>
      </Container>
    </section>
  );
};

export default FoodDelivery;
