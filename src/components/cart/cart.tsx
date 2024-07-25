"use client";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice } from "@/lib/utils";

import { BsCart4 } from "react-icons/bs";

import { Link, type Locale, useRouter } from "@/navigation";
import { api } from "@/trpc/react";
import { AnimatePresence, useAnimate, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useCartStore } from "../../providers/cart-store-provider";
import LoadingSpinner from "../loading/loading-spinner";
import { Badge } from "../ui/badge";
import LoadingButton from "../ui/loading-button";
import CartItem from "./cart-Item";

const Cart = () => {
  const { status } = useSession();
  const [scope, animate] = useAnimate();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const locale = useLocale() as Locale;
  const t = useTranslations("cart");
  const router = useRouter();
  const utils = api.useUtils();
  const storeItems = useCartStore(useShallow((state) => state.items));

  const storeTotalPrice = useCartStore(useShallow((state) => state.totalPrice));
  const storeTotalQuantity = useCartStore(
    useShallow((state) => state.totalQuantity),
  );
  const storedProductsIds = useCartStore(
    useShallow((state) => state.getAllProductIds()),
  );
  const clearStoredCart = useCartStore((state) => state.clearCart);
  const updateCartWithProducts = useCartStore(
    (state) => state.updateCartWithProducts,
  );
  const storeChanged = useCartStore(useShallow((state) => state.changed));
  const { mutate } = api.products.getProductsWithIds.useMutation({
    onSuccess: (data) => {
      if (data.length > 0) {
        updateCartWithProducts(data);
      } else {
        clearStoredCart();
      }
    },
  });

  const { mutate: createCheckoutSession, isPending: isCheckoutLoading } =
    api.checkout.createCheckoutSession.useMutation({
      onSuccess: (data) => {
        if (data) {
          router.push(data);
        }
      },
      onError: () => {
        toast.error(t("toast.error"));
      },
    });
  const { mutate: updateCart } = api.cart.updateCart.useMutation({
    onSuccess() {
      utils.cart.getUserCart.invalidate();
      clearStoredCart();
    },
  });
  const {
    data: cart,
    isSuccess,
    isLoading,
  } = api.cart.getUserCart.useQuery(undefined, {
    enabled: status === "authenticated",
    staleTime: Infinity,
  });

  useEffect(() => {
    if (storedProductsIds.length > 0) {
      mutate(storedProductsIds);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && isSuccess && storeChanged) {
      if (storeItems.length > 0 && (!cart || cart.items.length === 0)) {
        updateCart(
          storeItems.map((item) => ({
            additions: item.additions ?? [],
            quantity: item.quantity,
            productId: item.productId,
            size: item.size,
          })),
        );
      }
    }
  }, [status, isSuccess]);
  const checkoutHandler = () => {
    if (status === "authenticated") {
      createCheckoutSession();
    } else {
      router.push("/login");
    }
  };

  const items = status === "authenticated" ? cart?.items : storeItems;
  const totalPrice =
    status === "loading"
      ? 0
      : status === "authenticated"
        ? cart?.totalPrice ?? 0
        : storeTotalPrice ?? 0;
  const totalQuantity =
    status === "loading"
      ? 0
      : status === "authenticated"
        ? cart?.totalQuantity ?? 0
        : storeTotalQuantity ?? 0;

  useEffect(() => {
    if (
      totalQuantity > 0 &&
      (status === "authenticated" ||
        (status === "unauthenticated" && storeChanged))
    ) {
      animate(
        ".pump",
        { scale: [null, 0.8, 1.1, 1.3, 1] },
        {
          ease: "easeOut",
          duration: 0.3,
        },
      );
    }
  }, [totalQuantity, storeChanged, status]);

  const fee = 5;

  return (
    <Sheet>
      <SheetTrigger className="group relative  flex items-center ">
        <BsCart4
          aria-hidden="true"
          className="h-7 w-7 flex-shrink-0 text-muted-foreground group-hover:text-primary "
        />
        <div
          className=" absolute right-1 top-0 -translate-y-1/2 translate-x-1/2 transform"
          ref={scope}
        >
          <Badge className="pump px-2 ">{totalQuantity}</Badge>
        </div>
      </SheetTrigger>
      <SheetContent
        aria-describedby={undefined}
        className="flex  w-full flex-col pe-3 sm:max-w-lg"
        side={isMobile && locale === "ar" ? "left" : "right"}
      >
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-start">
            {t("title")} ({" "}
            <span className=" text-primary">{totalQuantity}</span> )
          </SheetTitle>
        </SheetHeader>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : totalQuantity > 0 ? (
            <div className=" flex w-full flex-1 flex-col ">
              {/* <div className="w-full flex-1 space-y-3 overflow-y-auto pe-3 "> */}
              <motion.ul
                key="list"
                exit={{ y: -30, opacity: 0 }}
                className="w-full flex-1 space-y-3 overflow-y-auto pe-3 "
              >
                {items &&
                  items.length > 0 &&
                  items.map((item) => (
                    <motion.li
                      layout
                      exit={{ y: -30, opacity: 0 }}
                      key={item.id}
                    >
                      <CartItem item={item} />
                    </motion.li>
                  ))}
              </motion.ul>
              {/* </div> */}
              <motion.div exit={{ y: 30, opacity: 0 }}>
                <SheetFooter className="w-full pe-3">
                  <div className="w-full space-y-4 ">
                    <Separator />
                    <div className="space-y-1.5 text-sm">
                      <div className="flex">
                        <span className="flex-1">{t("subtotal")}</span>
                        <span>
                          {formatPrice(totalPrice, {
                            currency: locale === "ar" ? "EGP" : "USD",
                          })}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="flex-1">{t("deliveryFee")}</span>
                        <span>
                          {formatPrice(fee, {
                            currency: locale === "ar" ? "EGP" : "USD",
                          })}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="flex-1">{t("total")}</span>
                        <span>
                          {formatPrice(totalPrice + fee, {
                            currency: locale === "ar" ? "EGP" : "USD",
                          })}
                        </span>
                      </div>
                    </div>

                    <LoadingButton
                      className="w-full"
                      onClick={checkoutHandler}
                      disabled={isCheckoutLoading}
                      isLoading={isCheckoutLoading}
                    >
                      {t("checkout")}
                    </LoadingButton>
                  </div>
                </SheetFooter>
              </motion.div>
            </div>
          ) : (
            <motion.div
              key="fallback"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-full flex-col items-center justify-center space-y-1"
            >
              <div
                aria-hidden="true"
                className="relative mb-4 h-60 w-60 text-muted-foreground"
              >
                <Image
                  src="/assets/images/empty-cart.jpg"
                  fill
                  alt="empty shopping cart"
                />
              </div>
              <div className="text-xl font-semibold">{t("empty")}</div>
              <SheetTrigger asChild>
                <Link
                  href="/products"
                  className={buttonVariants({
                    variant: "link",
                    size: "sm",
                    className:
                      "text-muted-foreground ltr:text-sm rtl:text-base",
                  })}
                >
                  {t("addItems")}
                </Link>
              </SheetTrigger>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
