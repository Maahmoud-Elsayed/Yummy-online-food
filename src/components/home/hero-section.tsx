import Image from "next/image";
import { Link } from "@/navigation";
import { buttonVariants } from "../ui/button";
import Container from "../ui/container";
import { useTranslations } from "next-intl";

const HeroSection = () => {
  const t = useTranslations("pages.home.heroSection");
  return (
    <section className="relative flex w-full items-center justify-between bg-green-50 rtl:flex-row-reverse">
      <Image
        className="hidden sm:block"
        src="/assets/images/banner-img-1.webp"
        alt="banner1"
        width={194}
        height={366}
        priority
      />
      <Container className="relative my-10 sm:absolute sm:left-1/2 sm:top-1/2 sm:my-0   sm:w-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:!p-0">
        <h2 className="  text-start text-2xl font-medium text-foreground sm:text-4xl sm:font-semibold sm:tracking-wider">
          {t("title")}
        </h2>
        <p className="my-3 text-muted-foreground sm:my-4 sm:font-medium">
          {t("description")}
        </p>
        <Link className={buttonVariants()} href="/products">
          {t("button")}
        </Link>
      </Container>

      <Image
        className="hidden h-auto w-auto sm:block"
        src="/assets/images/banner-img-2.webp"
        alt="banner2"
        height={340}
        width={460}
        priority
      />
    </section>
  );
};

export default HeroSection;
