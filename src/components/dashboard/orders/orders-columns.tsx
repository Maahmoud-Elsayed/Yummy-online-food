"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/table-header";
import dateBetweenFilterFn from "@/components/ui/data-table/utils";
import OrderActionColumn from "./order-action-column";

export type OrderTable = {
  id: string;
  total: number;
  status: "PAID" | "CANCELED" | "PENDING" | "DELIVERED";
  createdAt: Date;
  totalQuantity: number;
  customerName: string;
  customerEmail: string;
  userId: string | null;
};

export const getordersColumns = (t: (key: string) => string) => {
  const ordersColumns: ColumnDef<OrderTable>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mr-2 "
        />
      ),
      cell: ({ row }) => (
        <div className="mr-auto w-fit">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "customerEmail",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("email")} />;
      },
      enableColumnFilter: true,
      meta: {
        filterFn: "search",
        type: "text",
        filterOptions: null,
        name: t("email"),
      },
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("name")} />;
      },
      enableColumnFilter: true,
      meta: {
        filterFn: "search",
        type: "text",
        filterOptions: null,
        name: t("name"),
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("status")} />;
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as OrderTable["status"];
        return (
          <Badge
            className=" w-full justify-center py-1 text-xs"
            variant={
              status === "PAID" || status === "DELIVERED"
                ? "default"
                : status === "CANCELED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {t(status)}
          </Badge>
        );
      },
      enableColumnFilter: true,
      meta: {
        filterFn: "select",
        type: "select",
        filterOptions: [
          { name: t("PAID"), value: "PAID" },
          { name: t("CANCELED"), value: "CANCELED" },
          { name: t("PENDING"), value: "PENDING" },
          { name: t("DELIVERED"), value: "DELIVERED" },
        ],
        name: t("status"),
      },
    },
    {
      accessorKey: "createdAt",
      enableColumnFilter: true,
      meta: {
        filterFn: "date",
        type: "date",
        filterOptions: null,
        name: t("date"),
      },
      filterFn: dateBetweenFilterFn,
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("date")} />;
      },
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as Date;
        return (
          <div className="font-medium">{date.toLocaleDateString("en-GB")}</div>
        );
      },
    },
    {
      accessorKey: "totalQuantity",
      enableColumnFilter: true,
      meta: {
        filterFn: "range",
        type: "number",
        filterOptions: null,
        name: t("quantity"),
      },

      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("quantity")} />;
      },
    },
    {
      accessorKey: "total",
      enableColumnFilter: true,
      meta: {
        filterFn: "range",
        type: "number",
        filterOptions: null,
        name: t("amount"),
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("amount")} />;
      },
      cell: ({ row }) => {
        const amount = row.getValue("total") as number;
        return (
          <div className="font-medium">
            {amount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("actions")} />;
      },
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const order = row.original;

        return <OrderActionColumn order={order} />;
      },
    },
  ];

  return ordersColumns;
};
