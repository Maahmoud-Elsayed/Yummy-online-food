import { z } from "zod";

import type { Address, ExtraAddition } from "@/lib/types";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";

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
      console.error("Error fetching user orders:", error);
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
          },
          data: {
            status: "CANCELED",
          },
        });

        return order;
      } catch (error) {
        console.error("Error canceling order:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getUserOrder: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const order = await ctx.db.order.findUnique({
          where: {
            id: input,
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
          order.userId !== ctx.session.user.id &&
          ctx.session.user.role !== "ADMIN" &&
          ctx.session.user.role !== "MANAGER"
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
        console.error("Error fetching user order:", error);

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
