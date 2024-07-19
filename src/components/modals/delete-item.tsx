"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ErrorTemplate from "@/components/ui/error-template";
import LoadingButton from "@/components/ui/loading-button";
import { useRouter } from "@/navigation";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";

type DeleteCategoryProps = {
  id: string | null;
  type: "products" | "categories";
};

const DeleteItem = ({ id, type }: DeleteCategoryProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();
  const t = useTranslations(
    `${type === "categories" ? "dashboard.categories.modals.delete" : "dashboard.allProducts.modals"}`,
  );
  const { mutateAsync, isPending, error } = api.dashboard[
    type
  ].delete.useMutation({
    onSuccess: () => {
      utils.cart.getUserCart.invalidate();
      utils.dashboard.getDashboardSummary.invalidate();
      if (type === "products") {
        utils.products.invalidate();
        router.refresh();
      } else {
        utils.categories.getAll.invalidate();
      }
      setOpen(false);
    },
  });

  const deleteHandler = () => {
    if (!id) {
      return;
    }
    toast.promise(
      async () => {
        await mutateAsync(id);
      },
      {
        loading: t("toast.loading"),
        success: t("toast.success"),
        error: t("toast.failed"),
      },
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "categories" ? (
          <Button size="icon" variant="destructive">
            <FaTrash />
          </Button>
        ) : (
          <LoadingButton
            variant="destructive"
            size={"sm"}
            disabled={isPending}
            isLoading={isPending}
          >
            {t("delete")}
          </LoadingButton>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="py-2">
            {t("description")}
          </DialogDescription>
          {error && (
            <ErrorTemplate className="mt-0">{error.message}</ErrorTemplate>
          )}
        </DialogHeader>
        <DialogFooter className="flex gap-4">
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
          >
            {t("cancel")}
          </Button>
          <LoadingButton
            disabled={isPending}
            isLoading={isPending}
            type="button"
            variant="destructive"
            onClick={deleteHandler}
          >
            {t("delete")}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItem;
