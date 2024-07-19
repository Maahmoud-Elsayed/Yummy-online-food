import OrdersTable from "@/components/dashboard/orders/orders-table";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

export const generateMetadata = ({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) => {
  const data = {
    en: {
      title: "Orders",
      description: "Manage your customer's orders.",
    },
    ar: {
      title: "الطلبات",
      description: "إدارة طلبات عملائك.",
    },
  };

  return data[locale] ?? data.en;
};

const Orders = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  const t = useTranslations("dashboard.orders");
  return (
    <div className="my-10">
      <h1 className="mb-10 text-xl font-medium text-foreground">
        {t("title")}
      </h1>
      <OrdersTable />
    </div>
  );
};

export default Orders;
