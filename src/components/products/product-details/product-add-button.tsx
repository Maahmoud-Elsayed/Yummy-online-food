"use client";

import { parseAdditions } from "@/lib/utils";
import { useCartStore } from "@/providers/cart-store-provider";
import { type ProductInfo } from "@/server/api/routers/products";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";

type AddButtonProps = {
  product: NonNullable<ProductInfo>;
};
const ProductAddButton = ({ product }: AddButtonProps) => {
  const t = useTranslations("pages.productDetails");
  const searchParams = useSearchParams();
  const qty = searchParams.get("qty") ? Number(searchParams.get("qty")) : 1;
  const additionsParam = searchParams.get("additions");
  const sizeParam = searchParams.get("size");
  const additions = additionsParam ? additionsParam.split("_") : [];
  const size = sizeParam ? sizeParam : null;

  const utils = api.useUtils();
  const { mutate } = api.cart.addItem.useMutation({
    async onMutate(newProduct) {
      await utils.cart.getUserCart.cancel();
      const prevData = utils.cart.getUserCart.getData();
      utils.cart.getUserCart.setData(undefined, (old) => {
        let price = product.finalPrice ?? 0;
        if (product.sizes && product.sizes.length > 0) {
          const selectedSize = product.sizes.find(
            (item) => item.size === newProduct.size,
          );
          if (selectedSize) {
            price = selectedSize.finalPrice;
          }
        }
        if (product.additions && product.additions.length > 0) {
          if (newProduct.additions && newProduct.additions.length > 0) {
            newProduct.additions.forEach((addition: string) => {
              const selectedAddition = product.additions?.find(
                (item) => item.id === addition,
              );
              if (selectedAddition) {
                price += selectedAddition.price;
              }
            });
          }
        }
        const productTotalPrice = +(price * newProduct.quantity).toFixed(2);
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
                  totalPrice: +(item.totalPrice + productTotalPrice).toFixed(2),
                }
              : item,
          );

          return {
            items: updatedItems!,
            totalPrice: +((old?.totalPrice ?? 0) + productTotalPrice).toFixed(
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
                price: +price.toFixed(2),
                quantity: newProduct.quantity,
                additions: newProduct.additions ?? [],
                additions_en,
                additions_ar,
                fullAdditions,
                size: newProduct.size ?? "None",
                totalPrice: +(
                  (old?.totalPrice ?? 0) + productTotalPrice
                ).toFixed(2),
              },
            ],
            totalPrice: +((old?.totalPrice ?? 0) + productTotalPrice).toFixed(
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
  const { status } = useSession();
  const addItem = useCartStore((state) => state.addItem);
  const addItemHandler = () => {
    if (product.additions?.length === 0 && product.sizes?.length === 0) {
      if (status === "authenticated") {
        mutate({
          productId: product.id,
          quantity: qty,
        });
      } else {
        addItem({
          productId: product.id,
          name_en: product.name_en,
          name_ar: product.name_ar,
          image: product.image,
          price: product.finalPrice,
          quantity: qty,
          size: "None",
          additions: [],
          additions_ar: [],
          additions_en: [],
          fullAdditions: [],
          totalPrice: product.finalPrice * qty,
        });
      }
    } else {
      let price = product.finalPrice ?? 0;
      if (product.sizes && product.sizes.length > 0) {
        if (size === null) {
          return;
        }
        const selectedSize = product.sizes.find((item) => item.size === size);
        if (selectedSize) {
          price = selectedSize.finalPrice;
        }
      }
      if (product.additions && product.additions.length > 0) {
        if (additions.length > 0) {
          additions.forEach((addition: string) => {
            const selectedAddition = product.additions?.find(
              (item) => item.id === addition,
            );
            if (selectedAddition) {
              price += selectedAddition.price;
            }
          });
        }
      }

      if (status === "authenticated") {
        mutate({
          productId: product.id,
          quantity: qty,
          size: size ? (size as "Small" | "Medium" | "Large") : undefined,
          additions: additions,
        });
      } else {
        const { additions_en, additions_ar, fullAdditions } = parseAdditions(
          additions,
          product.additions,
        );
        addItem({
          productId: product.id,
          name_en: product.name_en,
          name_ar: product.name_ar,
          image: product.image,
          price: price,
          quantity: qty,
          size: size as "Small" | "Medium" | "Large" ?? "None",
          additions: additions,
          additions_en,
          additions_ar,
          fullAdditions,
          totalPrice: price * qty,
        });
      }
    }
  };
  return (
    <button
      className="group my-4  flex  w-full items-stretch overflow-hidden rounded-md text-primary-foreground"
      onClick={addItemHandler}
    >
      <div className="flex w-full items-center justify-center bg-primary py-2 text-sm uppercase  transition group-hover:bg-green-500">
        {t("addToCart")}
      </div>
      <div className="flex items-center justify-center bg-green-500 px-5 transition group-hover:bg-primary group-hover:text-white">
        <FaPlus className="h-3 w-3" />
      </div>
    </button>
  );
};

export default ProductAddButton;
