import { api } from "@/trpc/react";
import { type Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BsPersonFillSlash } from "react-icons/bs";
import { FaBan, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import LoadingButton from "../loading-button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../select";

type SelectedColumnsProps<TData> = {
  table: Table<TData>;
  type: "users" | "orders";
};

type UserActions =
  | "USER"
  | "ADMIN"
  | "MANAGER"
  | "SUSPEND"
  | "UNSUSPEND"
  | "DELETE";
type OrderActions = "PAID" | "PENDING" | "DELIVERED" | "CANCELED" | "DELETE";
type Action = UserActions | OrderActions;

const SelectedColumns = <TData,>({
  table,
  type,
}: SelectedColumnsProps<TData>) => {
  const [action, setAction] = useState<Action | "">("");
  const t = useTranslations(`dashboard.${type}`);
  const column = table.getColumn(type === "users" ? "role" : "status");

  const actions = column
    ? ((column.columnDef.meta as any)?.filterOptions.map(
        (option: { name: string; value: string }) => option.value,
      ) as string[])
    : [];
  const utils = api.useContext();
  const { mutateAsync, isPending } = api.dashboard[type].update.useMutation({
    onSuccess: () => {
      if (type === "orders") {
        utils.dashboard.orders.getAllOrders.invalidate();
        utils.dashboard.getDashboardSummary.invalidate();
        utils.dashboard.orders.getLatestOrders.invalidate();
      } else if (type === "users") {
        utils.dashboard.users.getAllUsers.invalidate();
        utils.dashboard.getDashboardSummary.invalidate();
      }
    },
  });

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="flex-1 text-sm text-foreground">
        {t("table.rows", {
          row: table.getFilteredSelectedRowModel().rows.length,
          totalRows: table.getFilteredRowModel().rows.length,
        })}
        {/* {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected. */}
      </div>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <>
          <Select
            onValueChange={(value) => setAction(value as Action)}
            name={"action"}
            value={action}
            disabled={isPending}
          >
            <SelectTrigger className="w-[150px] bg-white">
              <SelectValue placeholder={t("table.selectAction")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {t("table.change")} {column && t(`table.${column.id}`)}
                </SelectLabel>
                {actions.length > 0 &&
                  actions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {t(`table.${action}`)}
                    </SelectItem>
                  ))}
              </SelectGroup>
              {type === "users" && (
                <>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>
                      {t("table.change")} {t("table.status")}
                    </SelectLabel>
                    <SelectItem value="SUSPEND">
                      <div className="flex items-center gap-2 rtl:flex-row-reverse">
                        <FaBan className=" h-3 w-3 text-muted-foreground" />
                        <span>{t("table.suspend")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="UNSUSPEND">
                      <div className="flex items-center gap-2 rtl:flex-row-reverse">
                        <BsPersonFillSlash className=" h-4 w-4 text-muted-foreground" />
                        <span>{t("table.unSuspend")}</span>
                      </div>
                    </SelectItem>
                  </SelectGroup>
                </>
              )}
              <SelectSeparator />
              <SelectItem value="DELETE">
                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                  <FaTrash className=" h-3 w-3 text-muted-foreground" />
                  <span>{t("table.delete")}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <LoadingButton
            variant="outline"
            disabled={!action || isPending}
            isLoading={isPending}
            onClick={() => {
              const selectedIds: string[] = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => (row.original as any).id as string);
              if (!action || selectedIds.length < 1) {
                return;
              }
              toast.promise(
                async () => {
                  await mutateAsync({
                    id: selectedIds,

                    action: action as any,
                  });
                },
                {
                  loading: t("toast.loading", {
                    status: action === "DELETE" ? "delete" : "update",
                  }),
                  success() {
                    setAction("");
                    return t("toast.success", {
                      status: action === "DELETE" ? "delete" : "update",
                    });
                  },
                  error(error) {
                    return (
                      error.message ??
                      t("toast.failed", {
                        status: action === "DELETE" ? "delete" : "update",
                      })
                    );
                  },
                },
              );
            }}
          >
            {t("table.save")}
          </LoadingButton>
        </>
      )}
    </div>
  );
};

export default SelectedColumns;
