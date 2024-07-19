import { CiDeliveryTruck } from "react-icons/ci";
import { MdCancelPresentation, MdOutlinePendingActions } from "react-icons/md";
import SummaryCard from "../summary/summary-card";

import { IoBagCheckOutline, IoReceiptOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

type OrdersCountListProps = {
  allOrdersCount: number;
  pendingCount: number;
  canceledCount: number;
  paidCount: number;
  deliveredCount: number;
};
const OrdersCountList = ({
  allOrdersCount,
  pendingCount,
  canceledCount,
  paidCount,
  deliveredCount,
}: OrdersCountListProps) => {
  const t = useTranslations("dashboard.orders");
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      <SummaryCard
        title={t("total")}
        icon={<IoReceiptOutline className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">+{allOrdersCount}</div>
      </SummaryCard>
      <SummaryCard
        title={t("pending")}
        icon={
          <MdOutlinePendingActions className="h-5 w-5 text-muted-foreground" />
        }
      >
        <div className="text-2xl font-bold">+{pendingCount}</div>
      </SummaryCard>
      <SummaryCard
        title={t("canceled")}
        icon={
          <MdCancelPresentation className="h-5 w-5 text-muted-foreground" />
        }
      >
        <div className="text-2xl font-bold">+{canceledCount}</div>
      </SummaryCard>
      <SummaryCard
        title={t("paid")}
        icon={<IoBagCheckOutline className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">+{paidCount}</div>
      </SummaryCard>
      <SummaryCard
        title={t("delivered")}
        icon={<CiDeliveryTruck className="h-5 w-5 text-muted-foreground" />}
      >
        <div className="text-2xl font-bold">+{deliveredCount}</div>
      </SummaryCard>
    </div>
  );
};

export default OrdersCountList;
