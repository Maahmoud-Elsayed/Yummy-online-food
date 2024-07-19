"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/table-header";
import dateBetweenFilterFn from "@/components/ui/data-table/utils";
import UserActionColumn from "./user-action-column";

export type UserTable = {
  id: string;
  role: "USER" | "ADMIN" | "MANAGER";
  createdAt: Date;
  name: string;
  email: string;
  reviews: number;
  orders: number;
  image: string;
  status: "ACTIVE" | "SUSPENDED";
};
export const getUsersColumns = (t: (key: string) => string) => {
  const usersColumns: ColumnDef<UserTable>[] = [
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
          className="mr-2"
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
      accessorKey: "email",
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
      accessorKey: "name",
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
      accessorKey: "role",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("role")} />;
      },
      cell: ({ row }) => {
        const role = row.getValue("role") as UserTable["role"];
        return (
          <Badge
            className=" w-full justify-center py-1 text-xs"
            variant={
              role === "ADMIN" || role === "MANAGER" ? "default" : "secondary"
            }
          >
            {t(role)}
          </Badge>
        );
      },
      enableColumnFilter: true,
      meta: {
        filterFn: "select",
        type: "select",
        filterOptions: [
          { name: t("ADMIN"), value: "ADMIN" },
          { name: t("USER"), value: "USER" },
          { name: t("MANAGER"), value: "MANAGER" },
        ],
        name: t("role"),
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("status")} />;
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as UserTable["status"];
        return (
          <Badge
            className=" w-full justify-center py-1 text-xs"
            variant={status === "ACTIVE" ? "default" : "destructive"}
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
          { name: t("ACTIVE"), value: "ACTIVE" },
          { name: t("SUSPENDED"), value: "SUSPENDED" },
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
      accessorKey: "reviews",
      enableColumnFilter: true,
      meta: {
        filterFn: "range",
        type: "number",
        filterOptions: null,
        name: t("reviews"),
      },

      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("reviews")} />;
      },
    },
    {
      accessorKey: "orders",
      enableColumnFilter: true,
      meta: {
        filterFn: "range",
        type: "number",
        filterOptions: null,
        name: t("orders"),
      },
      header: ({ column }) => {
        return <DataTableColumnHeader column={column} title={t("orders")} />;
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
        const user = row.original;

        return <UserActionColumn user={user} />;
      },
    },
  ];

  return usersColumns;
};
