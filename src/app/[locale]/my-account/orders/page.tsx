import LoadingSpinner from "@/components/loading/loading-spinner";
import OrdersList from "@/components/my-account/orders/orders-list";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Orders",
      description: "View your orders details",
    },
    ar: {
      title: "طلبات",
      description: "عرض تفاصيل طلباتك",
    },
  };

  return data[locale] ?? data.en;
}

const Orders = ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OrdersList />
    </Suspense>
  );
};

export default Orders;
