import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";

export const reviewsRouter = createTRPCRouter({
  getProductReviews: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        limit: z.number().min(1).max(100).optional(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { limit = 5, productId, cursor } = input;
        const reviews = await ctx.db.product.findUnique({
          where: {
            id: productId,
          },
          select: {
            reviews: {
              orderBy: {
                createdAt: "desc",
              },
              take: limit + 1, // get an extra item at the end which we'll use as next cursor
              cursor: cursor ? { id: cursor } : undefined,
              include: {
                createdBy: {
                  select: { name: true, image: true, email: true },
                },
              },
            },
            _count: {
              select: { reviews: true },
            },
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (reviews && reviews.reviews?.length > limit) {
          const nextItem = reviews?.reviews.pop();
          nextCursor = nextItem!.id;
        }
        return {
          reviews,
          nextCursor,
          count: reviews?._count?.reviews ?? 0,
        };
      } catch (error) {
        console.log("Error fetching product reviews:", error);

        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  submitReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        comment: z.string().optional(),
        rate: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      try {
        const userId = ctx.session.user.id!;

        // Prepare review data
        let userReview = {
          productId: input.productId,
          rate: input.rate,
          createdById: userId,
          comment: input.comment,
        };

        // Perform upsert operation
        const review = await ctx.db.review.upsert({
          where: {
            productId_createdById: {
              productId: input.productId,
              createdById: userId,
            },
          },
          create: userReview,
          update: userReview,
        });

        if (review) {
          const avgRate = await ctx.db.review.groupBy({
            by: ["productId"],
            _avg: {
              rate: true,
            },
            where: {
              productId: {
                in: [input.productId],
              },
            },
          });
          if (avgRate[0]?._avg?.rate) {
            await ctx.db.product.update({
              where: {
                id: input.productId,
              },
              data: {
                avgRate: +avgRate[0]._avg.rate.toFixed(1),
              },
            });

            revalidatePath("/");
          }
        }

        return review;
      } catch (error) {
        console.log("Error submitting review:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
  getUserReview: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const review = await ctx.db.review.findUnique({
          where: {
            productId_createdById: {
              productId: input,
              createdById: ctx.session.user.id!,
            },
          },
          include: {
            createdBy: {
              select: { name: true, image: true, email: true },
            },
          },
        });
        return review;
      } catch (error) {
        console.log("Error fetching user review:", error);
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

export type Review = RouterOutputs["reviews"]["getUserReview"];
