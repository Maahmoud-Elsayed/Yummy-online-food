import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import OrderCard from "./order-card";
import { type UserOrders } from "@/server/api/routers/orders";
import { unstable_noStore as noStore } from "next/cache";
import { getTranslations } from "next-intl/server";

const OrdersList = async () => {
  noStore();
  let ordersDetails: UserOrders;
  try {
    ordersDetails = await api.orders.getUserOrders();
  } catch (error) {
    notFound();
  }
  const { orders, count } = ordersDetails || { orders: [], count: 0 };
  const t = await getTranslations("pages.myOrders");
  return (
    <div className="my-10">
      <h2 className="mb-10 text-xl font-medium text-foreground">
        {t("title")} (<span className="text-base text-primary"> {count} </span>)
      </h2>
      {orders?.length > 0 ? (
        <ul className="space-y-5">
          {orders?.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-20 text-center text-muted-foreground">{t("empty")}</p>
      )}
    </div>
  );
};

export default OrdersList;
