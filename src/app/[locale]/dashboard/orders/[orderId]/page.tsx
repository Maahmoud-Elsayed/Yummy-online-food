import LoadingSpinner from "@/components/loading/loading-spinner";
import Receipt from "@/components/my-account/orders/Receipt";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateMetadata({
  params: { locale },
}: {
  params: { locale: "en" | "ar" };
}) {
  const data = {
    en: {
      title: "Order",
      description: "View customer order details",
    },
    ar: {
      title: "طلب",
      description: "عرض تفاصيل طلب العميل",
    },
  };

  return data[locale] ?? data.en;
}

const Order = ({ params }: { params: { orderId: string } }) => {
  if (params.orderId.length !== 24) {
    notFound();
  }
  return (
    <div className="mb-20 mt-10">
      <Suspense fallback={<LoadingSpinner />}>
        <Receipt orderId={params.orderId} />
      </Suspense>
    </div>
  );
};

export default Order;
