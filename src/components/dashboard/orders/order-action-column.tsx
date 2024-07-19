import { FaTrash } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/navigation";

import { api } from "@/trpc/react";
import { toast } from "sonner";
import { type OrderTable } from "./orders-columns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import TableAction from "@/components/modals/table-action";

type ActionColumnProps = {
  order: OrderTable;
};

const OrderActionColumn = ({ order }: ActionColumnProps) => {
  const [openDelete, setOpenDelete] = useState(false);

  const utils = api.useUtils();
  const t = useTranslations("dashboard.orders");
  const { mutateAsync, isPending } =
    api.dashboard.orders.update.useMutation({
      onSuccess: () => {
        utils.dashboard.orders.getAllOrders.invalidate();
        utils.dashboard.orders.getLatestOrders.invalidate();
        utils.dashboard.getDashboardSummary.invalidate();
      },
    });

  const deleteOrderHandler = async () => {
    toast.promise(
      async () => {
        await mutateAsync({ id: [order.id], action: "DELETE" });
      },
      {
        loading: t("toast.loading", {
          status: "delete",
        }),
        success() {
          setOpenDelete(false);
          return t("toast.success", {
            status: "delete",
          });
        },
        error() {
          setOpenDelete(false);
          return t("toast.error", {
            status: "delete",
          });
        },
      },
    );
  };
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IoMdMore className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rtl:text-right">
          <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>
          <DropdownMenuItem asChild className="rtl:flex-row-reverse">
            <Link href={`/dashboard/orders/${order.id}`}>
              {t("table.receipt")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="rtl:flex-row-reverse">
              {t("table.status")}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {["PAID", "CANCELED", "PENDING", "DELIVERED"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={order.status === status}
                    disabled={isPending || order.status === status}
                    onClick={() => {
                      if (order.status === status) {
                        return;
                      }
                      toast.promise(
                        async () => {
                          await mutateAsync({
                            id: [order.id],
                            action: status as OrderTable["status"],
                          });
                        },
                        {
                          loading: t("toast.loading", {
                            status: "update",
                          }),
                          success: t("toast.success", {
                            status: "update",
                          }),
                          error: t("toast.error", {
                            status: "update",
                          }),
                        },
                      );
                    }}
                  >
                    {t(`table.${status}`)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2 rtl:flex-row-reverse"
            disabled={isPending}
            onClick={() => setOpenDelete(true)}
          >
            <FaTrash className=" h-3 w-3 text-muted-foreground" />
            <span>{t("table.delete")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TableAction
        open={openDelete}
        setOpen={setOpenDelete}
        title={t("modal.title")}
        description={t("modal.description")}
        cancel={t("modal.cancel")}
      >
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={deleteOrderHandler}
        >
          {t("modal.delete")}
        </Button>
      </TableAction>
    </>
  );
};

export default OrderActionColumn;
