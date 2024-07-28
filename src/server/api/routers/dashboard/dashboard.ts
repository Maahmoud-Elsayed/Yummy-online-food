import { calculatePercentageIncrease } from "@/lib/utils";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";

import { dashboardCategoriesRouter } from "./categories";
import { dashboardOrdersRouter } from "./orders";
import { dashboardProductsRouter } from "./products";
import { dashboardUsersRouter } from "./users";

export const dashboardRouter = createTRPCRouter({
  users: dashboardUsersRouter,
  orders: dashboardOrdersRouter,
  products: dashboardProductsRouter,
  categories: dashboardCategoriesRouter,

  getDashboardSummary: adminProcedure.query(async ({ ctx }) => {
    const currentDate = new Date();
    const currentMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const currentMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const previousMonthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0,
    );

    try {
      const [
        totalRevenuePrice,
        totalRevenueCurrentMonthPrice,
        totalRevenuePreviousMonthPrice,
        totalOrdersCount,
        totalOrdersCurrentMonthPrice,
        totalOrdersPreviousMonthPrice,
        totalUsersQuantity,
        totalUsersCurrentMonthQuantity,
        totalUsersPreviousMonthQuantity,
        totalSalesCount,
        totalSalesCurrentMonthPrice,
        totalSalesPreviousMonthPrice,
        totalProductsQuantity,
        totalCategoriesQuantity,
      ] = await ctx.db.$transaction([
        ctx.db.order.aggregate({
          _sum: { total: true },
          where: { OR: [{ status: "PAID" }, { status: "DELIVERED" }] },
        }),
        ctx.db.order.aggregate({
          _sum: {
            total: true,
          },
          where: {
            createdAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd,
            },
            AND: { OR: [{ status: "PAID" }, { status: "DELIVERED" }] },
          },
        }),
        ctx.db.order.aggregate({
          _sum: {
            total: true,
          },
          where: {
            createdAt: {
              gte: previousMonthStart,
              lte: previousMonthEnd,
            },
            AND: { OR: [{ status: "PAID" }, { status: "DELIVERED" }] },
          },
        }),
        ctx.db.order.count(),
        ctx.db.order.count({
          where: {
            createdAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd,
            },
          },
        }),
        ctx.db.order.count({
          where: {
            createdAt: {
              gte: previousMonthStart,
              lte: previousMonthEnd,
            },
          },
        }),
        ctx.db.user.count(),
        ctx.db.user.count({
          where: {
            createdAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd,
            },
          },
        }),
        ctx.db.user.count({
          where: {
            createdAt: {
              gte: previousMonthStart,
              lte: previousMonthEnd,
            },
          },
        }),
        ctx.db.order.aggregate({
          where: {
            OR: [{ status: "PAID" }, { status: "DELIVERED" }],
          },
          _sum: {
            totalQuantity: true,
          },
        }),
        ctx.db.order.aggregate({
          _sum: {
            totalQuantity: true,
          },
          where: {
            status: { in: ["PAID", "DELIVERED"] },
            createdAt: {
              gte: currentMonthStart,
              lte: currentMonthEnd,
            },
          },
        }),
        ctx.db.order.aggregate({
          _sum: {
            totalQuantity: true,
          },
          where: {
            status: { in: ["PAID", "DELIVERED"] },
            createdAt: {
              gte: previousMonthStart,
              lte: previousMonthEnd,
            },
          },
        }),
        ctx.db.product.count(),
        ctx.db.category.count(),
      ]);
      const totalRevenue = totalRevenuePrice?._sum?.total ?? 0;
      const totalRevenueCurrentMonth =
        totalRevenueCurrentMonthPrice?._sum?.total ?? 0;
      const totalRevenuePreviousMonth =
        totalRevenuePreviousMonthPrice?._sum?.total ?? 0;
      const totalOrders = totalOrdersCount ?? 0;
      const totalOrdersCurrentMonth = totalOrdersCurrentMonthPrice ?? 0;
      const totalOrdersPreviousMonth = totalOrdersPreviousMonthPrice ?? 0;
      const totalUsers = totalUsersQuantity ?? 0;
      const totalUsersCurrentMonth = totalUsersCurrentMonthQuantity ?? 0;
      const totalUsersPreviousMonth = totalUsersPreviousMonthQuantity ?? 0;
      const totalSales = totalSalesCount?._sum?.totalQuantity ?? 0;
      const totalSalesCurrentMonth =
        totalSalesCurrentMonthPrice?._sum?.totalQuantity ?? 0;
      const totalSalesPreviousMonth =
        totalSalesPreviousMonthPrice?._sum?.totalQuantity ?? 0;
      const totalProducts = totalProductsQuantity ?? 0;
      const totalCategories = totalCategoriesQuantity ?? 0;

      const percentageIncreaseSales = calculatePercentageIncrease(
        totalSalesPreviousMonth,
        totalSalesCurrentMonth,
      );

      // Calculate percentage increase for revenue
      const percentageIncreaseRevenue = calculatePercentageIncrease(
        totalRevenuePreviousMonth,
        totalRevenueCurrentMonth,
      );

      // Calculate percentage increase for orders
      const percentageIncreaseOrders = calculatePercentageIncrease(
        totalOrdersPreviousMonth,
        totalOrdersCurrentMonth,
      );

      // Calculate percentage increase for users
      const percentageIncreaseUsers = calculatePercentageIncrease(
        totalUsersPreviousMonth,
        totalUsersCurrentMonth,
      );

      return {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalSales,
        totalOrders,
        totalUsers,
        totalProducts,
        totalCategories,
        percentageIncreaseRevenue: Number(percentageIncreaseRevenue.toFixed(1)),
        percentageIncreaseOrders: Number(percentageIncreaseOrders.toFixed(1)),
        percentageIncreaseUsers: Number(percentageIncreaseUsers.toFixed(1)),
        percentageIncreaseSales: Number(percentageIncreaseSales.toFixed(1)),
      };
    } catch (error) {
      console.log("Error fetching dashboard summary", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
});

export type SummaryDetails = RouterOutputs["dashboard"]["getDashboardSummary"];
