import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import MotionDiv from "../ui/motion-div";
import { type Locale } from "@/navigation";
import Container from "../ui/container";

const GetApp = () => {
  const t = useTranslations("pages.home.getAppSection");
  const locale = useLocale() as Locale;
  return (
    <section>
      <Container className=" mb-20 mt-20 flex flex-col items-center justify-center gap-8  md:mb-0 md:flex-row md:gap-20">
        <MotionDiv
          initial={{ opacity: 0, x: locale === "en" ? -100 : 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <Image
            src="/assets/images/iphone.png"
            alt="phone"
            width={336}
            height={314}
          />
        </MotionDiv>
        <MotionDiv
          initial={{ opacity: 0, x: locale === "en" ? 100 : -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="mb-2   text-start text-2xl font-medium text-foreground md:text-3xl md:font-semibold ">
            {t("title")}
          </h2>
          <p className="text-center text-muted-foreground md:text-start">
            {t("description")}
          </p>
        </MotionDiv>
      </Container>
    </section>
  );
};

export default GetApp;
