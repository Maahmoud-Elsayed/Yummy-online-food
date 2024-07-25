import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { utapi } from "@/server/uploadthing";
import { TRPCError } from "@trpc/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { upsertCategoryServerSchema } from "@/lib/validations-schema/category-schema";

export const dashboardCategoriesRouter = createTRPCRouter({
  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const locale = ctx.locale;
    const id = input;

    try {
      const existingCategory = await ctx.db.category.findUnique({
        where: { id },
        include: {
          products: {
            select: { imageKey: true },
          },
        },
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: locale === "en" ? "Category not found" : "الفئة غير موجودة",
        });
      }

      const productsImageKeys = existingCategory.products.map(
        (product) => product.imageKey,
      );
      const imageKeys = [
        existingCategory.imageKey,
        ...productsImageKeys,
      ].filter(Boolean);

      await ctx.db.category.delete({ where: { id } });
      await utapi.deleteFiles(imageKeys);
      revalidatePath("/");

      return { success: true };
    } catch (error) {
      console.log("Error deleting category:", error);

      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
      });
    }
  }),

  upsertCategory: adminProcedure
    .input(upsertCategoryServerSchema)
    .mutation(async ({ ctx, input }) => {
      const locale = ctx.locale;
      const { id, categoryName_ar, categoryName_en, image } = input;
      const data: any = {
        name_en: categoryName_en,
        name_ar: categoryName_ar,
      };
      if (image) {
        data.image = image.url;
        data.imageKey = image.key;
      }
      try {
        if (id) {
          const existingCategory = await ctx.db.category.findUnique({
            where: { id },
          });

          if (!existingCategory) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                locale === "en" ? "Category not found" : "الفئة غير موجودة",
            });
          }
          await ctx.db.category.update({ where: { id }, data });
          if (image) {
            await utapi.deleteFiles(existingCategory.imageKey);
          }
          revalidatePath("/");
          return { success: true };
        }
        await ctx.db.category.create({ data });

        revalidatePath("/");
        return { success: true };
      } catch (error: any) {
        console.log("Error upserting category:", error);
        if (image) {
          await utapi.deleteFiles(image.key);
        }

        if (error instanceof TRPCError) {
          throw error;
        }

        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: `${locale === "en" ? "Category name already exists" : "اسم الفئة موجود بالفعل"}`,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `${locale === "ar" ? "حدث خطأ ما، يرجى المحاولة مرة أخرى لاحقًا" : "Something went wrong, please try again later"}`,
        });
      }
    }),
});
