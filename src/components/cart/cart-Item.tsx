import { formatPrice } from "@/lib/utils";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { type Locale } from "@/navigation";
import { type CartItem } from "@/server/api/routers/cart";
import { api } from "@/trpc/react";
import { Cross1Icon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { toast } from "sonner";
import { useCartStore } from "../../providers/cart-store-provider";
import { ExclamationIcon } from "../ui/icons/icons";

type NonNullableCart = NonNullable<CartItem>;
type NonNullableItem = NonNullable<NonNullableCart["items"][number]>;

type CartItemProps = {
  item: NonNullableItem;
};

const CartItem = ({ item }: CartItemProps) => {
  const {
    additions,
    additions_ar,
    additions_en,
    price,
    quantity,
    size,
    totalPrice,
    name_ar,
    name_en,
    image,
    id,
  } = item;
  const { status } = useSession();
  const t = useTranslations("cart");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const { mutate: removeFullItem, isPending: removeFullItemLoading } =
    api.cart.removeItem.useMutation({
      async onMutate(newProduct) {
        await utils.cart.getUserCart.cancel();
        const prevData = utils.cart.getUserCart.getData();
        utils.cart.getUserCart.setData(undefined, (old) => {
          const existingItem = old?.items.find(
            (item) => item.id === newProduct.id,
          );

          if (existingItem) {
            const updatedItems = old?.items.filter(
              (item) => item.id !== newProduct.id,
            );
            return {
              ...old,
              items: updatedItems ?? [],
              totalQuantity: old?.totalQuantity
                ? old.totalQuantity - existingItem.quantity
                : 0,
              totalPrice: old?.totalPrice
                ? +(old?.totalPrice - existingItem.totalPrice).toFixed(2)
                : 0,
            };
          } else {
            return old;
          }
        });
        return { prevData };
      },
      onError(err, newProduct, ctx) {
        utils.cart.getUserCart.setData(undefined, ctx?.prevData);
        toast.error(t("toast.failed"));
      },
      onSettled() {
        utils.cart.getUserCart.invalidate();
      },
    });
  const { mutate: removeOne } = api.cart.removeOneItem.useMutation({
    async onMutate(newProduct) {
      await utils.cart.getUserCart.cancel();
      const prevData = utils.cart.getUserCart.getData();
      utils.cart.getUserCart.setData(undefined, (old) => {
        const existingItem = old?.items.find(
          (item) => item.id === newProduct.id,
        );

        if (existingItem) {
          if (existingItem.quantity > 1) {
            const updatedItems = old?.items.map((item) =>
              item.id === newProduct.id
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    totalPrice: +(item.totalPrice - item.price).toFixed(2),
                  }
                : item,
            );
            return {
              ...old,
              items: updatedItems ?? [],
              totalQuantity: old?.totalQuantity ? old.totalQuantity - 1 : 0,
              totalPrice: old?.totalPrice
                ? +(old.totalPrice - existingItem.price).toFixed(2)
                : 0,
            };
          } else {
            const updatedItems = old?.items.filter(
              (item) => item.id !== newProduct.id,
            );
            return {
              ...old,
              items: updatedItems ?? [],
              totalPrice: old?.totalPrice
                ? +(old.totalPrice - existingItem.totalPrice).toFixed(2)
                : 0,
              totalQuantity: old?.totalQuantity
                ? old?.totalQuantity - existingItem.quantity
                : 0,
            };
          }
        }
      });
      return { prevData };
    },
    onError(err, newProduct, ctx) {
      utils.cart.getUserCart.setData(undefined, ctx?.prevData);
      toast.error(t("toast.failed"));
    },
    onSettled() {
      utils.cart.getUserCart.invalidate();
    },
  });

  const { mutate: increaseItem } = api.cart.increaseItem.useMutation({
    async onMutate(newProduct) {
      await utils.cart.getUserCart.cancel();
      const prevData = utils.cart.getUserCart.getData();
      utils.cart.getUserCart.setData(undefined, (old) => {
        const existingItem = old?.items.find(
          (item) => item.id === newProduct.id,
        );
        if (existingItem) {
          const updatedItems = old?.items.map((item) =>
            item.id === newProduct.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: +(item.totalPrice + item.price).toFixed(2),
                }
              : item,
          );
          return {
            ...old,
            items: updatedItems ?? [],
            totalQuantity: old?.totalQuantity ? old.totalQuantity + 1 : 0,
            totalPrice: old?.totalPrice
              ? +(old.totalPrice + existingItem.price).toFixed(2)
              : 0,
          };
        }
      });
      return { prevData };
    },
    onError(err, newProduct, ctx) {
      utils.cart.getUserCart.setData(undefined, ctx?.prevData);
      toast.error(t("toast.failed"));
    },
    onSettled() {
      utils.cart.getUserCart.invalidate();
    },
  });
  const increaseStoreItem = useCartStore((state) => state.inCreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const removeAllItem = useCartStore((state) => state.removeAllItem);
  return (
    <div className="flex justify-between gap-4 py-2 ">
      <div className="relative aspect-square h-[70px] w-[70px]  overflow-hidden rounded-md bg-[#f7f7f7]">
        <Image src={image} alt={name_en} fill className="object-fill" />
      </div>
      <div className="flex grow flex-col justify-between ">
        <div className="flex justify-between gap-4">
          <div className="flex grow flex-col justify-between gap-1 ">
            <span className=" line-clamp-1 truncate text-sm font-medium">
              {locale === "en" ? name_en : name_ar}
            </span>
            {size || additions ? (
              <div className="flex items-center gap-1.5 ">
                {size && size !== "None" ? (
                  <span className=" text-xs text-muted-foreground">
                    {t(`${size}`)}
                  </span>
                ) : null}
                {additions && additions.length > 0 && (
                  <HoverCard>
                    <HoverCardTrigger>
                      <ExclamationIcon className="h-3.5 w-3.5 cursor-pointer" />
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="top"
                      className="w-fit bg-black p-2 text-white"
                    >
                      <div className="flex flex-col items-center gap-1 ">
                        {(locale === "en" ? additions_en : additions_ar).map(
                          (addition) => (
                            <div key={addition} className="">
                              <span className="text-xs  ">{addition}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className=" line-clamp-1 text-sm">
              {formatPrice(totalPrice, {
                currency: locale === "ar" ? "EGP" : "USD",
              })}
            </span>
            {quantity > 1 ? (
              <span className="text-xs text-muted-foreground">
                {formatPrice(price, {
                  currency: locale === "ar" ? "EGP" : "USD",
                })}{" "}
                {t("each")}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-fit rounded-md border border-gray-200 p-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                if (status === "authenticated") {
                  removeOne({ id, quantity });
                } else {
                  removeItem(id);
                }
              }}
            >
              <MinusIcon className="h-4 w-4 text-primary" />
            </button>
            <span className="text-sm">{quantity}</span>
            <button
              type="button"
              className="h-fit rounded-md border border-gray-200 p-1 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                if (status === "authenticated") {
                  increaseItem({ id });
                } else {
                  const { id } = item;
                  increaseStoreItem(id);
                }
              }}
            >
              <PlusIcon className="h-4 w-4 text-primary" />
            </button>
          </div>
          <div className=" text-xs text-red-500">
            <button
              onClick={() => {
                if (status === "authenticated") {
                  removeFullItem({ id });
                } else {
                  removeAllItem(id);
                }
              }}
              className="flex items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={removeFullItemLoading}
            >
              <Cross1Icon className="h-4 w-3" />
              {t("remove")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
