import { cn } from "@/lib/utils";

import { useMemo } from "react";
import { FaBookOpen } from "react-icons/fa";
import { FiCreditCard } from "react-icons/fi";
import { ImUsers } from "react-icons/im";
import { IoReceiptOutline } from "react-icons/io5";
import { LiaSitemapSolid } from "react-icons/lia";
import { LuDollarSign } from "react-icons/lu";
import SummaryCard from "./summary-card";
import { type SummaryDetails } from "@/server/api/routers/dashboard/dashboard";
import { useTranslations } from "next-intl";

type SummaryCardListProps = {
  summary: SummaryDetails;
};

const SummaryCardList = ({ summary }: SummaryCardListProps) => {
  const t = useTranslations("dashboard.overview");
  const summaryCards = useMemo(() => {
    const {
      totalRevenue,
      totalSales,
      totalOrders,
      totalUsers,
      percentageIncreaseRevenue,
      percentageIncreaseOrders,
      percentageIncreaseUsers,
      percentageIncreaseSales,
      totalProducts,
      totalCategories,
    } = summary;
    const cards = [
      {
        title: t("totalRevenue"),
        icon: <LuDollarSign className="h-4 w-4 text-muted-foreground" />,
        value: totalRevenue,
        percentageIncrease: percentageIncreaseRevenue,
        withDollars: true,
      },
      {
        title: t("totalSales"),
        icon: <FiCreditCard className="h-4 w-4 text-muted-foreground" />,
        value: totalSales,
        percentageIncrease: percentageIncreaseSales,
        withDollars: false,
      },
      {
        title: t("totalOrders"),
        icon: <IoReceiptOutline className="h-4 w-4 text-muted-foreground" />,
        value: totalOrders,
        percentageIncrease: percentageIncreaseOrders,
        withDollars: false,
      },
      {
        title: t("totalUsers"),
        icon: <ImUsers className="h-4 w-4 text-muted-foreground" />,
        value: totalUsers,
        percentageIncrease: percentageIncreaseUsers,
        withDollars: false,
      },
      {
        title: t("totalCategories"),
        icon: <FaBookOpen className="h-4 w-4 text-muted-foreground" />,
        value: totalCategories,
        percentageIncrease: null,
        withDollars: false,
      },
      {
        title: t("totalProducts"),
        icon: <LiaSitemapSolid className="h-4 w-4 text-muted-foreground" />,
        value: totalProducts,
        percentageIncrease: null,
        withDollars: false,
      },
    ];
    return cards;
  }, [summary]);
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {summaryCards.map((card) => (
        <SummaryCard title={card.title} icon={card.icon} key={card.title}>
          <div className="text-2xl font-bold">
            {card.withDollars ? "$" : "+"}
            {card.value}
          </div>
          {card.percentageIncrease !== null && (
            <p className="text-xs text-muted-foreground">
              <span
                className={cn(
                  card.percentageIncrease < 0
                    ? "text-red-500"
                    : card.percentageIncrease > 0
                      ? "text-green-500"
                      : "text-muted-foreground",
                )}
              >
                {card.percentageIncrease >= 0 ? (
                  <span className="text-sm"> + </span>
                ) : null}
                {card.percentageIncrease}%{" "}
              </span>
              {t("fromLastMonth")}
            </p>
          )}
        </SummaryCard>
      ))}
    </div>
  );
};

export default SummaryCardList;
