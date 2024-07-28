import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formattedDate } from "@/lib/utils";
import { type Locale } from "@/navigation";
import { type OrderInfo } from "@/server/api/routers/orders";
import { api } from "@/trpc/server";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { IoIosClose } from "react-icons/io";

type ReceiptProps = {
  orderId: string;
  page: "user" | "admin";
};

const Receipt = async ({ orderId, page }: ReceiptProps) => {
  let order: OrderInfo;
  try {
    order = await api.orders.getUserOrder({ id: orderId, page });
  } catch (error) {
    notFound();
  }
  if (!order) {
    notFound();
  }
  const t = await getTranslations("pages.myOrders");
  const locale = (await getLocale()) as Locale;
  return (
    <div className=" w-full overflow-hidden rounded-md bg-gray-100">
      <div className="relative h-36 w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 top-0 z-0 h-full w-full  origin-top-left -skew-y-[12deg] transform bg-primary md:-skew-y-[6deg]"></div>
      </div>
      <div className="space-y-6 px-5 pb-10  md:px-2 lg:px-20">
        <div className="space-y-2">
          <h2 className="text-center text-2xl font-medium text-foreground">
            {t("receipt")}
          </h2>
          <h2 className="text-center font-medium text-muted-foreground">
            {t("order")} #{order.id}
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-4 text-center">
          <div className="  space-y-1 text-muted-foreground">
            <h3 className="text-xs font-semibold">{t("amount")}</h3>
            <p className="text-sm">${order.total}</p>
          </div>
          <div className="  space-y-1 text-muted-foreground">
            <h3 className="text-xs font-semibold">{t("date")}</h3>
            <p className="text-sm">{formattedDate(order.createdAt, locale)}</p>
          </div>
          <div className="  space-y-1 text-muted-foreground">
            <h3 className="text-xs font-semibold">{t("status")}</h3>
            <p className="text-sm">{t(order.status)}</p>
          </div>
        </div>
        <h3 className="text-sm font-medium text-foreground">{t("summary")}</h3>
        <Card className="space-y-2  p-4 text-sm text-muted-foreground">
          {order.items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="w-full">
                  <div className="flex items-center">
                    <span>{item[`name_${locale}`]} </span>
                    <IoIosClose className="inline h-5 w-5" />
                    <span>{item.quantity}</span>
                  </div>
                  <p className=" truncate text-xs  ">
                    {item.size &&
                      item.size !== "None" &&
                      `${t("size")} : ${t(item.size)}`}{" "}
                  </p>
                  {item.additions && item.additions.length > 0 && (
                    <p className="max-w-[50%] text-wrap text-xs">
                      {t("additions")} :{" "}
                      {item.additions
                        .map((add) => add.name[locale])
                        .join(" - ")}
                    </p>
                  )}
                </div>
                <p>${item.price}</p>
              </div>
              <Separator />
            </div>
          ))}
          <div className="flex justify-between">
            <p>{t("subtotal")}</p>
            <p>${order.subTotal}</p>
          </div>
          <div className="flex justify-between">
            <p>{t("deliveryFee")}</p>
            <p>${order.deliveryFee}</p>
          </div>
          <div className="flex justify-between font-semibold">
            <p>{t("total")}</p>
            <p>${order.total}</p>
          </div>
        </Card>
        <div className="flex flex-col justify-start gap-6 md:flex-row md:flex-wrap">
          <div className="  flex-1 space-y-6 ">
            <h3 className="text-sm font-medium text-foreground">
              {t("customerDetails")}
            </h3>
            <Card className="flex flex-col gap-2  p-4 text-sm text-muted-foreground">
              <p>
                {t("name")} : {order.customerName}
              </p>
              <p className="w-full truncate ">
                {t("email")} : {order.customerEmail}
              </p>
            </Card>
          </div>
          {order.address && (
            <div className=" flex-1 space-y-6">
              <h3 className="text-sm font-medium text-foreground">
                {t("address")}
              </h3>
              <Card className="flex w-full  flex-col gap-2 p-4 text-sm text-muted-foreground">
                {Object.keys(order.address).map((key) => (
                  <p key={key}>
                    {t(key)} :{" "}
                    {order.address?.[key as keyof typeof order.address]}
                  </p>
                ))}
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipt;
