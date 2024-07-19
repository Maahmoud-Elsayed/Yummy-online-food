import NotFoundImage from "@/components/not-found/not-found-image";
import { buttonVariants } from "@/components/ui/button";
import Container from "@/components/ui/container";
import MotionDiv from "@/components/ui/motion-div";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    },
    ar: {
      title: "صفحة غير موجودة",
      description: "الصفحة التي تبحث عنها غير موجودة.",
    },
  };

  return data[locale] ?? data.en;
}

const NotFound = () => {
  const t = useTranslations("pages.notFound");
  return (
    <MotionDiv
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 100 }}
      transition={{ ease: "easeIn", duration: 0.5 }}
    >
      <Container className="space-y-6">
        <NotFoundImage />
        <div className="mx-auto w-fit space-y-4 border-t border-gray-400 text-center">
          <h1 className="mt-6 text-2xl font-semibold text-destructive">
            {t("title")}
          </h1>
          <p className="mx-auto block max-w-prose text-muted-foreground">
            {t("description")}
          </p>
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            {t("backToHome")}
          </Link>
        </div>
      </Container>
    </MotionDiv>
  );
};

export default NotFound;
