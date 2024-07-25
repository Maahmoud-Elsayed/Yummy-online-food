import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";

export const categoriesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.db.category.findMany({
        select: {
          id: true,
          name_ar: true,
          name_en: true,
          image: true,
          imageKey: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      });

      return { count: categories.length, categories };
    } catch (error) {
      console.log("Error fetching categories:", error);

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

  getAllNames: publicProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.db.category.findMany({
        select: {
          id: true,
          name_ar: true,
          name_en: true,
        },
      });
      return categories;
    } catch (error) {
      console.log("Error fetching category names:", error);

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

export type Categories = RouterOutputs["categories"]["getAll"]["categories"];
