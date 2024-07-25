import type { ExtraAddition, ExtraSize } from "@/lib/types";
import { calculateCartTotals, getBaseUrl } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/server/stripe";
import { type OrderItem, type Size } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const checkoutRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const locale = ctx.locale;
    const deliveryFee = 5;
    const userId = ctx.session.user.id;
    try {
      const userCart = await ctx.db.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          CartItems: {
            select: {
              id: true,
              additions: true,
              productId: true,
              quantity: true,
              size: true,
              // },
              // include: {
              product: {
                select: {
                  name_en: true,
                  name_ar: true,
                  image: true,
                  price: true,
                  finalPrice: true,
                  additions: true,
                  sizes: true,
                  discount: true,
                },
              },
            },
          },
        },
      });

      if (!userCart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No products",
        });
      }
      const { CartItems } = userCart;
      const {
        items,
        totalPrice: cartTotalPrice,
        totalQuantity: cartTotalQuantity,
      } = await calculateCartTotals(CartItems);

      const orderItems = items.map((item) => {
        return {
          productId: item.productId,
          name_en: item.name_en,
          name_ar: item.name_ar,
          size: item.size,
          additions: item.fullAdditions
            ? JSON.stringify(item.fullAdditions)
            : undefined,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          totalPrice: item.totalPrice,
        };
      });

      const [deletedPrevOrders, order] = await ctx.db.$transaction([
        ctx.db.order.deleteMany({ where: { userId, status: "PENDING" } }),
        ctx.db.order.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            subTotal: cartTotalPrice,
            total: Number((cartTotalPrice + deliveryFee).toFixed(2)),
            totalQuantity: cartTotalQuantity,
            items: {
              createMany: {
                data: orderItems,
              },
            },
            status: "PENDING",
            deliveryFee,
            customerEmail: ctx.session.user.email!,
            customerName: ctx.session.user.name!,
          },
        }),
      ]);

      const lineItems = items.map((item) => {
        let description; // Initialize description variable

        // Check if size exists, add it to the description
        if (item.size && item.size !== "None") {
          description = `${locale === "ar" ? "الحجم" : "Size"} : ${item.size === "Large" ? "كبير" : item.size === "Medium" ? "وسط" : "صغير"}`;
        }

        // Check if additions exist, add them to the description
        if (item.additions && item.additions.length > 0) {
          description += ` - ${locale === "ar" ? "الاضافات" : "Additions"} : ${locale === "ar" ? item.additions_ar.join(", ") : item.additions_en.join(", ")}`;
        }
        const lineItem: any = {
          // adjustable_quantity: {
          //   enabled: true,
          // },
          quantity: item.quantity,
          price_data: {
            currency: "USD",
            product_data: {
              name: locale === "ar" ? item.name_ar : item.name_en,
              images: [item.image],
              description: description ?? undefined, // Use description or empty string if no description
              metadata: {
                id: item.id,
              },
            },
            unit_amount: Math.round(item.price * 100),
          },
        };
        if (description) {
          lineItem.price_data.product_data.description = description;
        }
        return lineItem;
      });

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        customer_email: ctx.session.user.email!,
        success_url: getBaseUrl() + "/my-account/orders/" + order.id,
        cancel_url: getBaseUrl() + "/products",
        metadata: { orderId: order.id, checkout: "new" },
        ui_mode: "hosted",
        submit_type: "pay",
        shipping_options: [
          {
            shipping_rate_data: {
              display_name: "Delivery fee",
              type: "fixed_amount",
              fixed_amount: { amount: deliveryFee * 100, currency: "USD" },
            },
          },
        ],
        billing_address_collection: "required",
      });

      return session.url;
    } catch (error) {
      console.log("Error in create checkout session", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  continueCheckout: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      try {
        const userId = ctx.session.user.id;
        const order = await ctx.db.order.findUnique({
          where: {
            id: input,
            userId,
          },
          include: {
            items: true,
          },
        });

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }
        const productsIds = order.items.map((item) => item.productId);
        const products = await ctx.db.product.findMany({
          where: {
            id: { in: productsIds },
          },
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            image: true,
            price: true,
            finalPrice: true,
            additions: true,
            sizes: true,
            discount: true,
          },
        });
        const fetchedProductIds = products.map((product) => product.id);
        const missingProductIds = productsIds.filter(
          (id) => !fetchedProductIds.includes(id),
        );
        let subTotal = 0;
        let totalQuantity = 0;
        const updatedItems = order.items.reduce(
          (acc: Partial<OrderItem>[], item) => {
            const product = products.find((p) => p.id === item.productId);
            if (product) {
              let additions = [];
              let size: Size = "None";
              const parsedProductAdditions = product.additions
                ? (JSON.parse(product.additions as string) as ExtraAddition[])
                : [];

              const parsedItemAdditions = item.additions
                ? (JSON.parse(item.additions as string) as ExtraAddition[])
                : [];

              const parsedProductSizes = product.sizes
                ? (JSON.parse(product.sizes as string) as ExtraSize[])
                : [];

              const commonAdditions = parsedItemAdditions.filter((addition) =>
                parsedProductAdditions.some(
                  (prodAdd) => prodAdd.id === addition.id,
                ),
              );

              let price = product.finalPrice ?? 0;

              if (parsedProductSizes && parsedProductSizes.length > 0) {
                const selectedSize = parsedProductSizes.find(
                  (size) => size.size === item.size,
                );
                if (selectedSize) {
                  price = selectedSize.finalPrice;
                  size = selectedSize.size;
                } else {
                  price = parsedProductSizes[0]?.finalPrice!;
                  size = parsedProductSizes[0]?.size!;
                }
              }

              if (commonAdditions.length > 0) {
                for (const item of commonAdditions) {
                  const foundItem = parsedProductAdditions.find(
                    (element) => element.id === item.id,
                  );
                  if (foundItem) {
                    additions.push(item);
                    price += foundItem.price;
                  }
                }
              }

              subTotal += item.quantity * price;

              totalQuantity += item.quantity;

              acc.push({
                id: item.id,
                productId: product.id,
                name_en: product.name_en,
                name_ar: product.name_ar,
                size: size ?? "None",
                additions:
                  additions.length > 0 ? JSON.stringify(additions) : undefined,
                quantity: item.quantity,
                image: product.image,
                price: price,
                totalPrice: item.quantity * price,
              });
            }
            return acc;
          },
          [],
        );

        if (updatedItems.length === 0) {
          await ctx.db.order.delete({
            where: {
              id: order.id,
            },
          });
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order items not exist any more",
          });
        }

        await ctx.db.$transaction([
          ...updatedItems.map((item) => {
            return ctx.db.orderItem.update({
              where: {
                id: item.id,
              },
              data: {
                additions: item.additions as string | undefined,
                size: item.size,
                quantity: item.quantity,
                totalPrice: item.totalPrice,
                price: item.price,
                image: item.image,
                name_ar: item.name_ar,
                name_en: item.name_en,
                productId: item.productId,
              },
            });
          }),
          ctx.db.orderItem.deleteMany({
            where: {
              id: {
                in: missingProductIds,
              },
            },
          }),
        ]);

        const updatedOrder = await ctx.db.order.update({
          where: {
            id: order.id,
          },
          data: {
            subTotal: Number(subTotal.toFixed(2)),
            total: Number((subTotal + order.deliveryFee).toFixed(2)),
            totalQuantity,
            customerEmail: ctx.session.user.email!,
            customerName: ctx.session.user.name!,
          },
          include: {
            items: true,
          },
        });
        if (updatedOrder.items.length === 0) {
          await ctx.db.order.delete({
            where: {
              id: updatedOrder.id,
            },
          });
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order items not exist any more",
          });
        }

        const lineItems = updatedOrder.items.map((item) => {
          let description;
          if (item.size && item.size !== "None") {
            description = `${locale === "ar" ? "الحجم" : "Size"} : ${item.size === "Large" ? "كبير" : item.size === "Medium" ? "وسط" : "صغير"}`;
          }

          if (item.additions) {
            const additions =
              (JSON.parse(item.additions as string) as ExtraAddition[]) ?? [];
            if (Array.isArray(additions) && additions.length > 0) {
              description += ` - ${locale === "ar" ? "الاضافات" : "Additions"} : ${additions
                .map((addition) => addition.name[locale])
                .join(", ")}`;
            }
          }
          const lineItem: any = {
            quantity: item.quantity,
            price_data: {
              currency: "USD",
              product_data: {
                name: locale === "en" ? item.name_en : item.name_ar,
                images: [item.image],
                description: description ?? undefined, // Use description or empty string if no description
                metadata: {
                  id: item.id,
                },
              },
              unit_amount: Math.round(item.price * 100),
            },
          };
          if (description) {
            lineItem.price_data.product_data.description = description;
          }
          return lineItem;
        });

        const session = await stripe.checkout.sessions.create({
          line_items: lineItems,
          mode: "payment",
          customer_email: ctx.session.user.email!,
          success_url: getBaseUrl() + "/my-account/orders/" + updatedOrder.id,
          cancel_url: getBaseUrl() + "/products",
          metadata: { orderId: updatedOrder.id, checkout: "update" },
          ui_mode: "hosted",
          submit_type: "pay",
          shipping_options: [
            {
              shipping_rate_data: {
                display_name: "Delivery fee",
                type: "fixed_amount",
                fixed_amount: {
                  amount: updatedOrder.deliveryFee * 100,
                  currency: "USD",
                },
              },
            },
          ],
          billing_address_collection: "required",
        });
        return session.url;
      } catch (error) {
        console.log("Error in continue checkout", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
