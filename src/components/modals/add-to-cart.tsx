import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { parseAdditions } from "@/lib/utils";
import { selectionSchema } from "@/lib/validations-schema/cart-schema";
import { type Locale } from "@/navigation";
import { useCartStore } from "@/providers/cart-store-provider";
import { type Product } from "@/server/api/routers/products";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";
import AdditionsSelect from "../products/add-selection/additions-select";
import Qty from "../products/add-selection/qty";
import SizeSelect from "../products/add-selection/size-select";

type FormData = z.infer<typeof selectionSchema>;

type AddSelectionFormProps = {
  product: Omit<Product, "category">;
};

const AddToCart = ({ product }: AddSelectionFormProps) => {
  const { addItem } = useCartStore((state) => state);
  const { status } = useSession();
  const t = useTranslations("pages.products.modals.addToCart");
  const locale = useLocale() as Locale;
  const utils = api.useUtils();
  const { mutate } = api.cart.addItem.useMutation({
    async onMutate(newProduct) {
      await utils.cart.getUserCart.cancel();
      const prevData = utils.cart.getUserCart.getData();
      utils.cart.getUserCart.setData(undefined, (old) => {
        const productTotalPrice = getValues("price") * getValues("quantity");
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
          return {
            items: [
              ...(old?.items ?? []),
              {
                id: crypto.randomUUID(),
                productId: product.id,
                name_en: product.name_en,
                name_ar: product.name_ar,
                image: product.image,
                price: +getValues("price").toFixed(2),
                quantity: newProduct.quantity,
                additions_ar: [],
                additions_en: [],
                fullAdditions: [],
                additions:
                  (newProduct.additions
                    ?.map((addition) => {
                      const selected = product.additions.find(
                        (item) => item.id === addition,
                      );
                      if (!selected) return undefined;
                      return selected.name[locale];
                    })
                    ?.filter(Boolean) as string[]) ?? [],
                size: newProduct.size ?? "None",
                totalPrice: +(
                  getValues("price") * getValues("quantity")
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
      utils.cart.getUserCart.setData(undefined, ctx?.prevData);
      toast.error(t("error"));
    },
    onSettled() {
      utils.cart.getUserCart.invalidate();
    },
  });
  const methods = useForm<FormData>({
    defaultValues: {
      quantity: 1,
      size: undefined,
      additions: [],
      price: 0,
      withSizes: product.sizes?.length > 0 ? true : false,
    },
    mode: "onSubmit",
    resolver: zodResolver(selectionSchema),
  });
  const { handleSubmit, getValues, reset } = methods;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (status === "authenticated") {
      mutate({
        productId: product.id,
        quantity: data.quantity,
        size: data.size,
        additions: data.additions,
      });
    } else {
      const { additions_en, additions_ar, fullAdditions } = parseAdditions(
        data.additions,
        product.additions,
      );

      addItem({
        productId: product.id,
        name_en: product.name_en,
        name_ar: product.name_ar,
        additions_en,
        additions_ar,
        fullAdditions,
        image: product.image,
        size: data.size ?? "None",
        additions: data.additions ?? [],
        quantity: data.quantity,
        totalPrice: data.price * data.quantity,
        price: +data.price,
      });
    }
  };
  return (
    <Dialog onOpenChange={() => reset()}>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          size={"sm"}
          className="group flex w-full  items-center justify-between overflow-hidden rounded-md p-0 disabled:cursor-not-allowed  rtl:flex-row-reverse "
        >
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs transition group-hover:bg-primary group-hover:text-white">
            {t("add")}
          </div>
          <div className="flex h-full items-center justify-center bg-gray-300 px-3 transition group-hover:bg-green-500 group-hover:text-white sm:px-5">
            <FaPlus className="h-3 w-3" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="max-w-3xl p-0">
        <DialogHeader>
          <DialogTitle className="w-full bg-gray-100 px-4 py-4 font-normal">
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
            <div className="space-y-4">
              <div className="flex w-full flex-col gap-5 px-4 md:flex-row">
                <div className="flex basis-1/2 flex-col gap-2">
                  <h3 className="text-sm font-bold text-muted-foreground ">
                    {product[`name_${locale}`]}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {product[`description_${locale}`]}
                  </p>
                </div>
                <Qty
                  additions={product.additions}
                  sizes={product.sizes}
                  defaultPrice={product.finalPrice}
                />
              </div>
              <Accordion
                type="multiple"
                defaultValue={["item-1"]}
                className="w-full"
              >
                {product.sizes.length > 0 && (
                  <AccordionItem value="item-1">
                    <SizeSelect sizes={product.sizes} />
                  </AccordionItem>
                )}
                {product.additions.length > 0 && (
                  <AccordionItem value="item-2">
                    <AdditionsSelect additions={product.additions} />
                  </AccordionItem>
                )}
              </Accordion>
            </div>
            <DialogFooter className="px-4">
              <Button type="submit" className="w-full md:mx-auto md:w-1/2 ">
                {t("addToCart")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCart;
