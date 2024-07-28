import { z } from "zod";

import type { Address, ExtraAddition } from "@/lib/types";
import { mergeCounts } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";

export const ordersRouter = createTRPCRouter({
  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    try {
      const userId = ctx.session.user.id;
      const [orders, count] = await ctx.db.$transaction([
        ctx.db.order.findMany({
          where: {
            userId,
          },
          select: {
            id: true,
            status: true,
            total: true,
            createdAt: true,
            totalQuantity: true,
            updatedAt: true,
            deliveryFee: true,
            subTotal: true,
          },
        }),
        ctx.db.order.count({ where: { userId } }),
      ]);

      return { orders, count };
    } catch (error) {
      console.log("Error fetching user orders:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  cancelOrder: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const order = await ctx.db.order.update({
          where: {
            id: input,
            status: "PAID",
            userId: ctx.session.user.id,
          },
          data: {
            status: "CANCELED",
          },
          include: { items: { select: { productId: true, quantity: true } } },
        });

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found or order status is not PAID",
          });
        }

        const mergedCounts = mergeCounts(order.items);
        await ctx.db.$transaction(
          mergedCounts.map((product) =>
            ctx.db.product.update({
              where: { id: product.productId },
              data: { sold: { decrement: product.quantity } },
            }),
          ),
        );

        revalidatePath("/");

        return order;
      } catch (error) {
        console.log("Error canceling order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getUserOrder: protectedProcedure
    .input(z.object({ id: z.string(), page: z.enum(["user", "admin"]) }))
    .query(async ({ ctx, input }) => {
      try {
        const order = await ctx.db.order.findUnique({
          where: {
            id: input.id,
          },
          include: { items: true },
        });
        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Order not found",
          });
        }
        if (
          (input.page === "user" && order.userId !== ctx.session.user.id) ||
          (input.page === "admin" && ctx.session.user.role === "USER")
        ) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not authorized to access this order",
          });
        }
        return {
          ...order,
          address: order.address
            ? (JSON.parse(order.address as string) as Address)
            : undefined,
          items: order.items.map((item) => {
            return {
              ...item,
              additions: item.additions
                ? (JSON.parse(item.additions as string) as ExtraAddition[])
                : [],
            };
          }),
        };
      } catch (error) {
        console.log("Error fetching user order:", error);

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

export type Orders = RouterOutputs["orders"]["getUserOrders"]["orders"];
export type OrderInfo = RouterOutputs["orders"]["getUserOrder"];
export type UserOrders = RouterOutputs["orders"]["getUserOrders"];
