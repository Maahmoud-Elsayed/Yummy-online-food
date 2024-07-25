import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { type RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const dashboardOrdersRouter = createTRPCRouter({
  getLatestOrders: adminProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      try {
        const orders = await ctx.db.order.findMany({
          take: input ? input : 5,
          where: {
            status: "PAID",
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        return orders;
      } catch (error) {
        console.log("Error fetching latest orders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getAllOrders: adminProcedure.query(async ({ ctx }) => {
    try {
      const [
        allOrdersCount,
        pendingCount,
        canceledCount,
        paidCount,
        deliveredCount,
        orders,
      ] = await ctx.db.$transaction([
        ctx.db.order.count(),
        ctx.db.order.count({ where: { status: "PENDING" } }),
        ctx.db.order.count({ where: { status: "CANCELED" } }),
        ctx.db.order.count({ where: { status: "PAID" } }),
        ctx.db.order.count({ where: { status: "DELIVERED" } }),
        ctx.db.order.findMany({
          select: {
            id: true,
            createdAt: true,
            status: true,
            total: true,
            totalQuantity: true,
            userId: true,
            customerEmail: true,
            customerName: true,
          },
        }),
      ]);

      return {
        orders,
        allOrdersCount,
        pendingCount,
        canceledCount,
        paidCount,
        deliveredCount,
      };
    } catch (error) {
      console.log("Error fetching all orders:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),

  update: adminProcedure
    .input(
      z.object({
        action: z.enum(["PENDING", "CANCELED", "PAID", "DELIVERED", "DELETE"]),
        id: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      try {
        const { action, id } = input;

        if (action === "DELETE") {
          await ctx.db.order.deleteMany({
            where: {
              id: {
                in: id,
              },
            },
          });
        } else {
          await ctx.db.order.updateMany({
            where: {
              id: {
                in: id,
              },
            },
            data: {
              status: action,
            },
          });
        }
      } catch (error) {
        console.log("Error updating orders:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
});

export type OrderDetails =
  RouterOutputs["dashboard"]["orders"]["getAllOrders"]["orders"][number];
export type AllOrders = RouterOutputs["dashboard"]["orders"]["getAllOrders"];
