import AccountForm from "@/components/my-account/account-settings/account-form";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

const MyAccount = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  const t = useTranslations("pages.myAccount");
  return (
    <div className="my-10">
      <h2 className="text-xl font-medium text-foreground">{t("title")}</h2>
      <AccountForm />
    </div>
  );
};

export default MyAccount;
