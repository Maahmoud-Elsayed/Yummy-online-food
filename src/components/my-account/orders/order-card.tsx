import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formattedDate } from "@/lib/utils";
import { type Orders } from "@/server/api/routers/orders";
import { Link } from "@/navigation";
import OrderActions from "./order-actions";
import { useLocale, useTranslations } from "next-intl";
import { type Locale } from "@/navigation";

type OrderCardProps = {
  order: Orders[number];
};

const OrderCard = ({ order }: OrderCardProps) => {
  const t = useTranslations("pages.myOrders");
  const locale = useLocale() as Locale;
  return (
    <div className=" space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {t("order")}{" "}
            <span className="text-sm text-muted-foreground">#{order.id}</span>
          </h3>
          <p className="text-sm text-muted-foreground">
            {t("placed")} {formattedDate(order.createdAt, locale)}
          </p>
        </div>
        <span
          className={cn(
            `h-fit rounded-md px-2 py-1 text-xs font-semibold `,
            order.status === "PAID" && "bg-green-500 text-primary-foreground",
            order.status === "CANCELED" && "bg-red-500 text-primary-foreground",
            order.status === "PENDING" && "bg-gray-200 text-foreground",
            order.status === "DELIVERED" &&
              "bg-green-500 text-primary-foreground",
          )}
        >
          {t(order.status)}
        </span>
      </div>
      <Separator />
      <div className="flex justify-between text-sm">
        <p className=" font-semibold text-foreground">{t("totalQuantity")}</p>
        <p className=" font-semibold text-muted-foreground">
          {order.totalQuantity}
        </p>
      </div>
      <div className="flex justify-between text-sm">
        <p className=" font-semibold text-foreground">{t("subtotal")}</p>
        <p className="  font-semibold text-muted-foreground">
          ${order.subTotal}
        </p>
      </div>
      <div className="flex justify-between text-sm">
        <p className=" font-semibold text-foreground">{t("deliveryFee")}</p>
        <p className="  font-semibold text-muted-foreground">
          ${order.deliveryFee}
        </p>
      </div>
      <div className="flex justify-between text-sm">
        <p className=" font-semibold text-foreground">{t("total")}</p>
        <p className="  font-semibold text-muted-foreground">${order.total}</p>
      </div>
      <Separator />
      <div className="flex justify-end gap-4">
        <OrderActions status={order.status} id={order.id} />
        <Link
          href={`/my-account/orders/${order.id}`}
          className={buttonVariants({
            variant: "default",
            size: "sm",
          })}
        >
          {t("viewOrder")}
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
