"use client";

import { api } from "@/trpc/react";

import { type Product } from "@/server/api/routers/products";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";
import { useCartStore } from "../../providers/cart-store-provider";
import AddToCart from "../modals/add-to-cart";
import { Button } from "../ui/button";
import { parseAdditions } from "@/lib/utils";

type AddButtonProps = {
  product: Omit<Product, "category">;
};

const AddButton = ({ product }: AddButtonProps) => {
  const { status } = useSession();
  const { addItem } = useCartStore((state) => state);

  const utils = api.useUtils();
  const t = useTranslations("pages.productDetails");
  const { mutate } = api.cart.addItem.useMutation({
    async onMutate(newProduct) {
      await utils.cart.getUserCart.cancel();
      const prevData = utils.cart.getUserCart.getData();
      utils.cart.getUserCart.setData(undefined, (old) => {
        const existingItem = old?.items.find(
          (item) =>
            item.productId === newProduct.productId &&
            item.size === (newProduct.size ?? "None") &&
            JSON.stringify(item.additions?.sort() ?? []) ===
              JSON.stringify(newProduct.additions?.sort() ?? []),
        );

        if (existingItem) {
          const updatedItems = old?.items.map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity: item.quantity + newProduct.quantity,
                  totalPrice: +(item.totalPrice + product.finalPrice).toFixed(
                    2,
                  ),
                }
              : item,
          );

          return {
            items: updatedItems!,
            totalPrice: +((old?.totalPrice ?? 0) + product.finalPrice).toFixed(
              2,
            ),
            totalQuantity: (old?.totalQuantity ?? 0) + newProduct.quantity,
          };
        } else {
          const { additions_en, additions_ar, fullAdditions } = parseAdditions(
            newProduct.additions ?? [],
            product.additions,
          );
          return {
            items: [
              ...(old?.items ?? []),
              {
                id: crypto.randomUUID(),
                productId: product.id,
                name_en: product.name_en,
                name_ar: product.name_ar,
                image: product.image,
                price: +product.finalPrice.toFixed(2),
                quantity: newProduct.quantity,
                additions: newProduct.additions ?? [],
                additions_en,
                additions_ar,
                fullAdditions,
                size: newProduct.size ?? "None",
                totalPrice: +(product.finalPrice * newProduct.quantity).toFixed(
                  2,
                ),
              },
            ],
            totalPrice: +((old?.totalPrice ?? 0) + product.finalPrice).toFixed(
              2,
            ),
            totalQuantity: (old?.totalQuantity ?? 0) + newProduct.quantity,
          };
        }
      });
      return { prevData };
    },
    onError(err, newProduct, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.cart.getUserCart.setData(undefined, ctx?.prevData);
      toast.error(t("error"));
    },
    onSettled() {
      utils.cart.getUserCart.invalidate();
    },
  });
  const addItemHandler = () => {
    if (status === "authenticated") {
      mutate({
        productId: product.id,
        quantity: 1,
      });
    } else {
      addItem({
        productId: product.id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        image: product.image,
        price: product.finalPrice,
        quantity: 1,
        size: "None",
        additions_ar: [],
        additions_en: [],
        fullAdditions: [],
        additions: [],
        totalPrice: product.finalPrice,
      });
    }
  };
  return (
    <>
      {product.price &&
      product.additions.length === 0 &&
      product.sizes.length === 0 ? (
        <Button
          // disabled={isPending}
          variant={"outline"}
          size={"sm"}
          className="group flex w-full items-center justify-between overflow-hidden rounded-md p-0 disabled:cursor-not-allowed  rtl:flex-row-reverse "
          onClick={addItemHandler}
        >
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs transition group-hover:bg-primary group-hover:text-white">
            {t("add")}
          </div>
          <div className="flex h-full items-center justify-center bg-gray-300 px-3 transition group-hover:bg-green-500 group-hover:text-white sm:px-5">
            <FaPlus className="h-3 w-3" />
          </div>
        </Button>
      ) : (
        <AddToCart product={product} />
      )}
    </>
  );
};

export default AddButton;
