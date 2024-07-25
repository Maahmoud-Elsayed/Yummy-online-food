import { createProductServerSchema } from "@/lib/validations-schema/product-schema";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { utapi } from "@/server/uploadthing";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const dashboardProductsRouter = createTRPCRouter({
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const locale = ctx.locale;
    try {
      const deletedProduct = await ctx.db.product.delete({
        where: { id: input },
      });

      if (!deletedProduct) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `${locale === "ar" ? "المنتج غير موجود" : "Product not found"}`,
        });
      }
      revalidatePath("/");
      await utapi.deleteFiles(deletedProduct.imageKey);
    } catch (error) {
      console.log("Error deleting product:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
      });
    }
  }),
  createOrUpdateProduct: adminProcedure
    .input(createProductServerSchema)
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      const {
        productId,
        productName_en,
        productName_ar,
        description_en,
        description_ar,
        price,
        category,
        image,
        sizes,
        additions,
        discount,
      } = input;

      try {
        let finalPrice = +Number(price).toFixed(2) ?? 0;
        if (discount && Number(discount) > 0) {
          const discountPrice = Number(price) * (Number(discount) / 100);
          finalPrice = +(Number(price) - discountPrice).toFixed(2);
        }

        const sizesWithNumberPrices = sizes?.map((size) => {
          const discountPrice = Number(size.price) * (Number(discount) / 100);
          return {
            ...size,
            price: +Number(size.price).toFixed(2),
            finalPrice: +(Number(size.price) - discountPrice).toFixed(2),
          };
        });

        const additionsWithNumberPrices = additions?.map((addition) => ({
          ...addition,
          price: +Number(addition.price).toFixed(2),
        }));

        if (productId) {
          const existingProduct = await ctx.db.product.findUnique({
            where: { id: productId },
          });

          if (!existingProduct) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message:
                locale === "en" ? "Product not found" : "المنتج غير موجود",
            });
          }
          let data = {
            name_en: productName_en,
            name_ar: productName_ar,
            description_en: description_en,
            description_ar: description_ar,
            price: Number(price),
            finalPrice,
            categoryId: category,
            sizes: sizesWithNumberPrices
              ? JSON.stringify(sizesWithNumberPrices)
              : undefined,
            additions: additionsWithNumberPrices
              ? JSON.stringify(additionsWithNumberPrices)
              : undefined,
            discount: Number(discount) || 0,
            imageKey: existingProduct.imageKey,
            image: existingProduct.image,
          };

          if (image) {
            const { url, key } = image;
            data = {
              ...data,
              image: url,
              imageKey: key,
            };
          }

          await ctx.db.product.update({
            where: { id: productId },
            data,
          });
          if (image) {
            await utapi.deleteFiles(existingProduct.imageKey);
          }
        } else {
          const { url, key } = image!;
          await ctx.db.product.create({
            data: {
              name_en: productName_en,
              name_ar: productName_ar,
              description_en: description_en,
              description_ar: description_ar,
              price: Number(price),
              finalPrice,
              image: url,
              imageKey: key,
              category: { connect: { id: category } },
              sizes: sizesWithNumberPrices
                ? JSON.stringify(sizesWithNumberPrices)
                : undefined,
              additions: additionsWithNumberPrices
                ? JSON.stringify(additionsWithNumberPrices)
                : undefined,
              discount: Number(discount) ?? 0,
            },
          });
        }

        revalidatePath("/");
        return {
          success: true,
        };
      } catch (error) {
        console.log("Error creating product:", error);

        if (image) {
          await utapi.deleteFiles(image.key);
        }
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
});
