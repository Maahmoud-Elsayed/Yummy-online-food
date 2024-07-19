import CategoriesList from "@/components/dashboard/categories/categories-list";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

export const generateMetadata = ({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) => {
  const data = {
    en: {
      title: "Categories",
      description:
        "Effortlessly manage your categories. Add, edit, and delete to keep everything organized.",
    },
    ar: {
      title: "الفئات",
      description:
        "إدارة الفئات بسهولة. إضافة وتعديل وحذف للحفاظ على كل شيء منظمًا.",
    },
  };

  return data[locale] ?? data.en;
};

const Categories = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  const t = useTranslations("dashboard.categories");
  return (
    <div className="my-10 ">
      <h2 className=" text-xl font-medium text-foreground">{t("title")}</h2>
      <CategoriesList />
    </div>
  );
};

export default Categories;
