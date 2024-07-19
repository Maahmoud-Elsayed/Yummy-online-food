import { z } from "zod";

import { itemSchema } from "@/lib/validations-schema/cart-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

import { calculateCartTotals } from "@/lib/utils";
import { RouterOutputs } from "@/trpc/react";

export const cartRouter = createTRPCRouter({
  getUserCart: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;
      const cart = await ctx.db.user.findUnique({
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
              product: {
                select: {
                  name_ar: true,
                  name_en: true,
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

      if (!cart) {
        return null;
      }

      const { CartItems } = cart;

      const {
        items,
        totalPrice: cartTotalPrice,
        totalQuantity: cartTotalQuantity,
      } = await calculateCartTotals(CartItems);

      return {
        items,
        totalPrice: cartTotalPrice,
        totalQuantity: cartTotalQuantity,
      };
    } catch (error) {
      console.error("Error getting user cart:", error);
      if (error instanceof TRPCError) {
        throw error;
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }
  }),

  updateCart: protectedProcedure
    .input(
      z.array(
        z.object({
          productId: z.string(),
          quantity: z.number(),
          size: z.enum(["Small", "Medium", "Large", "None"]).optional(),
          additions: z.array(z.string()),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session.user.id;
        const itemsToCreate = input.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size ?? "None",
          additions:
            item.additions.length > 0 ? JSON.stringify(item.additions) : "",
          userId: userId!,
        }));

        await ctx.db.cartItem.createMany({
          data: itemsToCreate,
        });

        return { success: true };
      } catch (error) {
        console.error("Error updating cart:", error);
        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),

  addItem: protectedProcedure
    .input(itemSchema)
    .mutation(async ({ ctx, input }) => {
      const { productId, size, additions = [], quantity } = input;

      try {
        const userCart = await ctx.db.cartItem.upsert({
          where: {
            productId_size_additions_userId: {
              productId: productId,
              size: size ? size : "None",
              additions:
                additions.length > 0 ? JSON.stringify(additions.sort()) : "",
              userId: ctx.session.user.id!,
            },
          },
          create: {
            product: { connect: { id: productId } },
            user: { connect: { id: ctx.session.user.id } },
            size: size ? size : "None",
            additions:
              additions.length > 0 ? JSON.stringify(additions.sort()) : "",
            quantity,
          },
          update: {
            quantity: { increment: quantity },
          },
        });

        return userCart;
      } catch (error) {
        // Handle error gracefully
        console.error("Error adding item to cart:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  removeItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.cartItem.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        console.error("Error removing item from cart:", error);

        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),

  removeOneItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        quantity: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.quantity > 1) {
          await ctx.db.cartItem.update({
            where: { id: input.id },
            data: {
              quantity: {
                decrement: 1,
              },
            },
          });
        } else {
          await ctx.db.cartItem.delete({
            where: { id: input.id },
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Error removing one item from cart:", error);

        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),

  increaseItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.cartItem.update({
          where: { id: input.id },
          data: {
            quantity: {
              increment: 1,
            },
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Error increasing item quantity in cart:", error);

        if (error instanceof TRPCError) {
          throw error;
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),
});

export type CartItem = RouterOutputs["cart"]["getUserCart"];
