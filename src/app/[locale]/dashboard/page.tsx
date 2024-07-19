import SummaryDetails from "@/components/dashboard/summary/summary-details";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

const Dashboard = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  const t = useTranslations("dashboard.overview");
  return (
    <div className="my-10">
      <h2 className="mb-10 text-xl font-medium text-foreground">
        {t("title")}
      </h2>
      <SummaryDetails />
    </div>
  );
};

export default Dashboard;
