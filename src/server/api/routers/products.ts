import { z } from "zod";

import type { ExtraAddition, ExtraSize } from "@/lib/types";
import { filteredProductsSchema } from "@/lib/validations-schema/product-schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { RouterOutputs } from "@/trpc/react";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(filteredProductsSchema)
    .query(async ({ ctx, input }) => {
      try {
        const { page, take = 10, sortBy, ...filter } = input;
        const skip = (page - 1) * take;

        let orderBy = {};

        // Set up the sorting logic based on the provided sortBy parameter
        switch (sortBy) {
          case "price-asc":
            orderBy = { finalPrice: "asc" };
            break;
          case "price-desc":
            orderBy = { finalPrice: "desc" };
            break;
          case "date-asc":
            orderBy = { createdAt: "asc" };
            break;
          case "date-desc":
            orderBy = { createdAt: "desc" };
            break;
          case "sold-asc":
            orderBy = { sold: "asc" };
            break;
          case "sold-desc":
            orderBy = { sold: "desc" };
            break;
          case "rating-asc":
            orderBy = { avgRate: "asc" };
            break;
          case "rating-desc":
            orderBy = { avgRate: "desc" };
            break;
          default:
            break;
        }

        // Set up the filter options
        const where: any = {};

        if (filter) {
          if (filter.minPrice) {
            where["finalPrice"] = {
              gte: Number(filter.minPrice),
            };
          }
          if (filter.maxPrice) {
            where["finalPrice"] = {
              ...where["finalPrice"],
              lte: Number(filter.maxPrice),
            };
          }

          if (filter.category) {
            const categories = filter.category.split("-");
            where.OR = [
              {
                category: {
                  name_ar: {
                    in: categories,
                  },
                },
              },
              {
                category: {
                  name_en: {
                    in: categories,
                  },
                },
              },
            ];
          }

          if (filter.discount && filter.discount === "true") {
            where["discount"] = {
              gt: 0,
            };
          }
          if (filter.search) {
            const fullText = filter.search.trim().split(/\s+/).join(" | ");
            const searchWords = filter.search.trim().split(/\s+/);
            where.OR = [
              ...(where.OR ?? []),
              {
                name_ar: {
                  search: fullText,
                },
              },
              {
                name_en: {
                  search: fullText,
                },
              },
              ...searchWords.map((word) => ({
                name_ar: {
                  contains: word,
                },
              })),
              ...searchWords.map((word) => ({
                name_en: {
                  contains: word,
                },
              })),
            ];
          }
        }

        const [productsCount, totalProducts] = await ctx.db.$transaction([
          ctx.db.product.count({ where, orderBy }),
          ctx.db.product.findMany({
            take,
            skip,
            orderBy,
            where,
            include: {
              _count: {
                select: { reviews: true },
              },
              category: {
                select: { name_ar: true, name_en: true },
              },
            },
          }),
        ]);

        const totalPages = Math.ceil(productsCount / take);
        return {
          products:
            totalProducts.length > 0
              ? totalProducts.map((product) => ({
                  ...product,
                  additions: product.additions
                    ? (JSON.parse(
                        product.additions as string,
                      ) as ExtraAddition[])
                    : [],
                  sizes: product.sizes
                    ? (JSON.parse(product.sizes as string) as ExtraSize[])
                    : [],
                }))
              : [],
          totalPages,
          hasNextPage: page < totalPages,
        };
      } catch (error) {
        console.error("Error fetching products:", error);

        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  filteredProducts: publicProcedure
    .input(
      z.object({
        filter: z.enum(["latest", "mostSelling", "withDiscount"]),
        take: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const { filter, take = 5 } = input;

        let orderBy: any = {};
        let where: any = {};

        switch (filter) {
          case "latest":
            orderBy = { createdAt: "desc" };
            break;
          case "mostSelling":
            orderBy = { sold: "desc" };
            where = { sold: { gt: 0 } };
            break;
          case "withDiscount":
            orderBy = { discount: "desc" };
            where = { discount: { gt: 0 } };
            break;
          default:
            break;
        }

        const products = await ctx.db.product.findMany({
          orderBy,
          where,
          take,
          skip: 0,
          include: {
            _count: {
              select: { reviews: true },
            },
          },
        });

        return products.length > 0
          ? products.map((product) => {
              return {
                ...product,
                additions: product?.additions
                  ? (JSON.parse(
                      product?.additions as string,
                    ) as ExtraAddition[])
                  : [],
                sizes: product?.sizes
                  ? (JSON.parse(product?.sizes as string) as ExtraSize[])
                  : [],
              };
            })
          : [];
      } catch (error) {
        console.error("Error fetching latest products:", error);

        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  getProductName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.findUnique({
          where: {
            id: input,
          },
          select: {
            name_ar: true,
            name_en: true,
          },
        });
        return product;
      } catch (error) {
        console.error("Error fetching product name:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getProductInfo: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const product = await ctx.db.product.findUnique({
          where: {
            id: input,
          },
          include: {
            _count: {
              select: { reviews: true },
            },
          },
        });

        return product
          ? {
              ...product,
              additions: product?.additions
                ? (JSON.parse(product?.additions as string) as ExtraAddition[])
                : [],
              sizes: product?.sizes
                ? (JSON.parse(product?.sizes as string) as ExtraSize[])
                : [],
            }
          : null;
      } catch (error) {
        console.error("Error fetching product info:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  getProductsWithIds: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ ctx, input }) => {
      try {
        const products = await ctx.db.product.findMany({
          where: {
            id: {
              in: input,
            },
          },
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            image: true,
            price: true,
            finalPrice: true,
            discount: true,
            sizes: true,
            additions: true,
          },
        });
        return products.length > 0
          ? products.map((product) => {
              return {
                ...product,
                additions: product?.additions
                  ? (JSON.parse(
                      product?.additions as string,
                    ) as ExtraAddition[])
                  : [],
                sizes: product?.sizes
                  ? (JSON.parse(product?.sizes as string) as ExtraSize[])
                  : [],
              };
            })
          : [];
      } catch (error) {
        console.error("Error fetching products with IDs:", error);

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

export type Product = RouterOutputs["products"]["getAll"]["products"][number];
export type FeaturedProducts = RouterOutputs["products"]["filteredProducts"];
export type ProductInfo = RouterOutputs["products"]["getProductInfo"];
export type ProductWithId = RouterOutputs["products"]["getProductsWithIds"];
