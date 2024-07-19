import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@/navigation";
import { IoIosLock } from "react-icons/io";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Access Denied",
      description: "You do not have permission to view this page.",
    },
    ar: {
      title: "الوصول مرفوض",
      description: "ليس لديك الإذن لعرض هذه الصفحة.",
    },
  };

  return data[locale] ?? data.en;
}
export default function AccessDenied({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("pages.denied");
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 px-2.5">
      <Card className="space-y-4 rounded-lg bg-white p-8 text-center shadow-lg">
        <IoIosLock className="mx-auto h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-semibold text-destructive">
          {t("title")}
        </h1>
        <p className="max-w-prose  text-muted-foreground">{t("description")}</p>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("goToHome")}
        </Link>
      </Card>
    </div>
  );
}
