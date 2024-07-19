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
import { FaBan } from "react-icons/fa";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BsPersonFillSlash } from "react-icons/bs";
import { toast } from "sonner";
import { type UserTable } from "./users-columns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import TableAction from "@/components/modals/table-action";

type UserActionColumnProps = {
  user: UserTable;
};

const UserActionColumn = ({ user }: UserActionColumnProps) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [openSuspend, setOpenSuspend] = useState(false);
  const { data: session } = useSession();
  const utils = api.useUtils();
  const t = useTranslations("dashboard.users");
  const { mutateAsync, isPending } = api.dashboard.users.update.useMutation({
    onSuccess: () => {
      utils.dashboard.users.getAllUsers.invalidate();
      utils.dashboard.getDashboardSummary.invalidate();
      if (user.id === session?.user.id) {
        utils.auth.authChecker.invalidate();
      }
    },
  });

  const suspendUserHandler = async () => {
    toast.promise(
      async () => {
        await mutateAsync({
          id: [user.id],
          action: user.status === "SUSPENDED" ? "UNSUSPEND" : "SUSPEND",
        });
      },
      {
        loading: t("toast.loading", { status: "suspend" }),
        success() {
          setOpenSuspend(false);
          return t("toast.success", { status: "suspend" });
        },
        error(error) {
          return error.message ?? t("toast.failed", { status: "suspend" });
        },
      },
    );
  };

  const deleteUserHandler = async () => {
    toast.promise(
      async () => {
        await mutateAsync({ id: [user.id], action: "DELETE" });
      },
      {
        loading: t("toast.loading", { status: "delete" }),
        success() {
          setOpenDelete(false);
          return t("toast.success", { status: "delete" });
        },
        error(error) {
          return error.message ?? t("toast.failed", { status: "delete" });
        },
      },
    );
  };

  return (
    <>
      <Dialog>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IoMdMore className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rtl:text-right">
            <DropdownMenuLabel className="rtl:text-right">
              {t("table.actions")}
            </DropdownMenuLabel>

            <DialogTrigger disabled={!user.image}>
              <DropdownMenuItem>
                <span>{t("table.profilePic")}</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rtl:flex-row-reverse">
                {t("table.role")}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {["ADMIN", "USER", "MANAGER"].map((role) => (
                    <DropdownMenuCheckboxItem
                      key={role}
                      checked={user.role === role}
                      disabled={isPending || user.role === role}
                      onClick={() => {
                        if (user.role === role) {
                          return;
                        }
                        if (session?.user?.role !== "MANAGER") {
                          toast.error(t("toast.error"));
                          return;
                        }
                        toast.promise(
                          async () => {
                            await mutateAsync({
                              action: role as UserTable["role"],
                              id: [user.id],
                            });
                          },
                          {
                            loading: t("toast.loading", { status: "update" }),
                            success: t("toast.success", { status: "update" }),
                            error: t("toast.failed", { status: "update" }),
                          },
                        );
                      }}
                    >
                      {t(`table.${role}`)}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 rtl:flex-row-reverse"
              disabled={isPending}
              onClick={() => setOpenSuspend(true)}
            >
              {user.status === "SUSPENDED" ? (
                <BsPersonFillSlash className=" text-success h-4 w-4" />
              ) : (
                <FaBan className=" h-3 w-3 text-muted-foreground" />
              )}
              <span>
                {user.status === "SUSPENDED"
                  ? t("table.unSuspend")
                  : t("table.suspend")}
              </span>
            </DropdownMenuItem>
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
        <DialogContent className="flex aspect-square w-full max-w-sm items-center justify-center p-0">
          <div className="relative h-full w-full overflow-hidden rounded-lg ">
            <Image src={user.image} alt={user.name} fill />
          </div>
        </DialogContent>
      </Dialog>
      <TableAction
        open={openDelete}
        setOpen={setOpenDelete}
        title={t("modals.delete.title")}
        description={t("modals.delete.description")}
        cancel={t("modals.delete.cancel")}
      >
        <Button
          variant="destructive"
          disabled={isPending}
          onClick={deleteUserHandler}
        >
          {t("modals.delete.delete")}
        </Button>
      </TableAction>
      <TableAction
        open={openSuspend}
        setOpen={setOpenSuspend}
        title={t("modals.suspend.title", { status: user.status })}
        description={t("modals.suspend.description", { status: user.status })}
        cancel={t("modals.suspend.cancel")}
      >
        <Button
          variant={user.status === "SUSPENDED" ? "default" : "destructive"}
          disabled={isPending}
          onClick={suspendUserHandler}
        >
          {user.status === "SUSPENDED"
            ? t("table.unSuspend")
            : t("table.suspend")}
        </Button>
      </TableAction>
    </>
  );
};

export default UserActionColumn;
