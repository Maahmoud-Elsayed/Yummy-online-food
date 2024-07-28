import LoadingSpinner from "@/components/loading/loading-spinner";
import Receipt from "@/components/my-account/orders/Receipt";
import { Suspense } from "react";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Order",
      description: "View your order details",
    },
    ar: {
      title: "طلب",
      description: "عرض تفاصيل طلبك",
    },
  };

  return data[locale] ?? data.en;
}

const Order = ({ params }: { params: { orderId: string } }) => {
  return (
    <div className="my-6 flex justify-center">
      <Suspense fallback={<LoadingSpinner />}>
        <Receipt orderId={params.orderId} page="user" />
      </Suspense>
    </div>
  );
};

export default Order;
