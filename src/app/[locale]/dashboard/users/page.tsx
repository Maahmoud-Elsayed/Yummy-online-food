import UsersTable from "@/components/dashboard/users/users-table";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

export const generateMetadata = ({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) => {
  const data = {
    en: {
      title: "Users",
      description: "Manage your user's account.",
    },
    ar: {
      title: "المستخدمين",
      description: "إدارة حسابات المستخدمين",
    },
  };

  return data[locale] ?? data.en;
};

const Users = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  const t = useTranslations("dashboard.users");
  return (
    <div className="my-10">
      <h1 className="mb-10 text-xl font-medium text-foreground">
        {t("title")}
      </h1>
      <UsersTable />
    </div>
  );
};

export default Users;
