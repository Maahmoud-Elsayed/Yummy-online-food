"use client";
import LoadingButton from "@/components/ui/loading-button";
import { useRouter } from "@/navigation";
import { api } from "@/trpc/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type OrderActionsProps = {
  status: "PENDING" | "PAID" | "CANCELED" | "DELIVERED";
  id: string;
};

const OrderActions = ({ status, id }: OrderActionsProps) => {
  const router = useRouter();
  const t = useTranslations("pages.myOrders");
  const utils = api.useUtils();
  const { mutateAsync, isPending } = api.orders.cancelOrder.useMutation({
    onSuccess: () => {
      utils.orders.getUserOrders.invalidate();
      router.refresh();
    },
  });
  const { mutate: checkoutMutate, isPending: checkoutPending } =
    api.checkout.continueCheckout.useMutation({
      onSuccess: (data) => {
        if (data) {
          router.push(data);
        }
      },
      onError: () => {
        toast.error(t("toast.error"));
        utils.orders.getUserOrders.invalidate();
        router.refresh();
      },
    });
  return (
    <>
      {status === "PAID" && (
        <LoadingButton
          variant="destructive"
          size={"sm"}
          isLoading={isPending}
          disabled={isPending}
          onClick={() =>
            toast.promise(
              async () => {
                await mutateAsync(id);
              },
              {
                loading: t("toast.loading"),
                success: t("toast.success"),
                error: t("toast.failed"),
              },
            )
          }
        >
          {t("cancelOrder")}
        </LoadingButton>
      )}
      {status === "PENDING" && (
        <LoadingButton
          variant="default"
          size={"sm"}
          isLoading={checkoutPending}
          disabled={checkoutPending}
          onClick={() => checkoutMutate(id)}
        >
          {t("continueCheckout")}
        </LoadingButton>
      )}
    </>
  );
};

export default OrderActions;
