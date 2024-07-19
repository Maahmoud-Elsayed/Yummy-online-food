"use client";
import LoadingSpinner from "@/components/loading/loading-spinner";
import { DataTable } from "@/components/ui/data-table/data-table";
import { type Locale } from "@/navigation";
import { api } from "@/trpc/react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";
import { getordersColumns } from "./orders-columns";
import OrdersCountList from "./orders-count-list";

const OrdersTable = () => {
  const { data, isLoading } = api.dashboard.orders.getAllOrders.useQuery();
  const locale = useLocale() as Locale;

  const t = useTranslations("dashboard.orders.table");
  const Columns = useMemo(() => {
    return getordersColumns(t);
  }, [locale]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <section className="mb-10 mt-5">
        <OrdersCountList
          allOrdersCount={data?.allOrdersCount ?? 0}
          pendingCount={data?.pendingCount ?? 0}
          canceledCount={data?.canceledCount ?? 0}
          paidCount={data?.paidCount ?? 0}
          deliveredCount={data?.deliveredCount ?? 0}
        />
      </section>
      <section className="my-5">
        {data && (
          <DataTable columns={Columns} data={data?.orders} type="orders" />
        )}
      </section>
    </>
  );
};

export default OrdersTable;
